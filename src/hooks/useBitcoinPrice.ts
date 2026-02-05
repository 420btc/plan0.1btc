import { useState, useEffect, useCallback, useRef } from 'react';

interface PriceData {
  price: number;
  priceEUR: number;
  change24h: number;
  high24h: number;
  low24h: number;
  timestamp: number;
}

interface PriceHistory {
  time: string;
  price: number;
}

export const useBitcoinPrice = () => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const fetchCurrentPrice = useCallback(async () => {
    try {
      const [tickerResponse, eurResponse] = await Promise.all([
        fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT'),
        fetch('https://api.binance.com/api/v3/ticker/price?symbol=EURUSDT')
      ]);

      if (!tickerResponse.ok || !eurResponse.ok) {
        throw new Error('Failed to fetch price data');
      }

      const ticker = await tickerResponse.json();
      const eurRate = await eurResponse.json();
      
      const priceUSD = parseFloat(ticker.lastPrice);
      const eurUsdRate = parseFloat(eurRate.price);
      const priceEUR = priceUSD / eurUsdRate;

      setPriceData({
        price: priceUSD,
        priceEUR,
        change24h: parseFloat(ticker.priceChangePercent),
        high24h: parseFloat(ticker.highPrice),
        low24h: parseFloat(ticker.lowPrice),
        timestamp: Date.now(),
      });

      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError('Error al obtener precio');
      setIsLoading(false);
    }
  }, []);

  const fetchPriceHistory = useCallback(async () => {
    try {
      const response = await fetch(
        'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=24'
      );
      
      if (!response.ok) throw new Error('Failed to fetch history');
      
      const data = await response.json();
      const history: PriceHistory[] = data.map((kline: any[]) => ({
        time: new Date(kline[0]).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        price: parseFloat(kline[4]),
      }));
      
      setPriceHistory(history);
    } catch (err) {
      console.error('Error fetching price history:', err);
    }
  }, []);

  useEffect(() => {
    fetchCurrentPrice();
    fetchPriceHistory();

    // WebSocket para precio en tiempo real
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
    wsRef.current = ws;

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      
      try {
        const eurResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=EURUSDT');
        const eurRate = await eurResponse.json();
        const eurUsdRate = parseFloat(eurRate.price);
        const priceUSD = parseFloat(data.c);
        
        setPriceData({
          price: priceUSD,
          priceEUR: priceUSD / eurUsdRate,
          change24h: parseFloat(data.P),
          high24h: parseFloat(data.h),
          low24h: parseFloat(data.l),
          timestamp: Date.now(),
        });
      } catch {
        // Use last known EUR rate or estimate
        const priceUSD = parseFloat(data.c);
        setPriceData(prev => ({
          price: priceUSD,
          priceEUR: prev?.priceEUR ? priceUSD / (prev.price / prev.priceEUR) : priceUSD * 0.92,
          change24h: parseFloat(data.P),
          high24h: parseFloat(data.h),
          low24h: parseFloat(data.l),
          timestamp: Date.now(),
        }));
      }
    };

    ws.onerror = () => {
      setError('Error en conexión WebSocket');
    };

    // Actualizar historial cada 5 minutos
    const historyInterval = setInterval(fetchPriceHistory, 5 * 60 * 1000);

    return () => {
      ws.close();
      clearInterval(historyInterval);
    };
  }, [fetchCurrentPrice, fetchPriceHistory]);

  return { priceData, priceHistory, isLoading, error };
};
