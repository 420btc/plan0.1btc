import { useState, useEffect } from 'react';
import { Calculator, ArrowRightLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SatsConverterProps {
  currentPriceEUR: number | null;
  currentPriceUSD: number | null;
}

export const SatsConverter = ({ currentPriceEUR, currentPriceUSD }: SatsConverterProps) => {
  const [currency, setCurrency] = useState<'EUR' | 'USD'>('EUR');
  const [fiatAmount, setFiatAmount] = useState<string>('50');
  const [satsAmount, setSatsAmount] = useState<string>('');
  const [lastEdited, setLastEdited] = useState<'fiat' | 'sats'>('fiat');

  const selectedPrice = currency === 'EUR' ? currentPriceEUR : currentPriceUSD;

  useEffect(() => {
    if (!selectedPrice) return;
    if (lastEdited === 'fiat') {
      const fiat = parseFloat(fiatAmount);
      if (!isNaN(fiat)) {
        const sats = (fiat / selectedPrice) * 100000000;
        setSatsAmount(Math.floor(sats).toString());
      } else {
        setSatsAmount('');
      }
      return;
    }
    const sats = parseFloat(satsAmount);
    if (!isNaN(sats)) {
      const fiat = (sats / 100000000) * selectedPrice;
      setFiatAmount(fiat.toFixed(2));
    } else {
      setFiatAmount('');
    }
  }, [fiatAmount, lastEdited, satsAmount, selectedPrice]);

  const handleFiatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastEdited('fiat');
    setFiatAmount(e.target.value);
  };

  const handleSatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastEdited('sats');
    setSatsAmount(e.target.value);
  };

  return (
    <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Calculadora Sats</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant={currency === 'EUR' ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrency('EUR')}
              className="h-7 px-3 text-xs"
            >
              EUR
            </Button>
            <Button
              variant={currency === 'USD' ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrency('USD')}
              className="h-7 px-3 text-xs"
            >
              USD
            </Button>
          </div>
          <div className="text-[10px] text-muted-foreground font-mono">
            {currency === 'EUR' ? '€' : '$'}
            {selectedPrice ? selectedPrice.toLocaleString(currency === 'EUR' ? 'es-ES' : 'en-US', { maximumFractionDigits: 2 }) : '---'}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground ml-1">
            {currency === 'EUR' ? 'Euros (€)' : 'Dólares ($)'}
          </label>
          <div className="relative">
            <Input
              type="number"
              value={fiatAmount}
              onChange={handleFiatChange}
              className="bg-black/20 border-white/10 text-lg font-mono pl-3 pr-8"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              {currency === 'EUR' ? '€' : '$'}
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground ml-1">Satoshis (sats)</label>
          <div className="relative">
            <Input
              type="number"
              value={satsAmount}
              onChange={handleSatsChange}
              className="bg-black/20 border-white/10 text-lg font-mono pl-3 pr-12 text-primary"
              placeholder="0"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-sm font-bold">sats</span>
          </div>
        </div>
      </div>
    </div>
  );
};
