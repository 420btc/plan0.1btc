export interface Purchase {
  id: number;
  targetPrice: number;
  btcAmount: number;
  estimatedCostEUR: number;
  estimatedDate: string;
  completed: boolean;
  completedAt?: string;
  actualPrice?: number;
  actualCostEUR?: number;
}

export type PlanType = 'conservative' | 'moderate' | 'aggressive';

export const PLAN_DETAILS: Record<PlanType, { name: string; description: string; startPrice: number; endPrice: number }> = {
  conservative: {
    name: 'Conservador',
    description: 'Esperar gran caída (95k - 45k)',
    startPrice: 95000,
    endPrice: 45000,
  },
  moderate: {
    name: 'Moderado',
    description: 'Rango amplio (75k - 25k)',
    startPrice: 75000,
    endPrice: 25000,
  },
  aggressive: {
    name: 'Agresivo',
    description: 'Moon shot (100k - 200k)',
    startPrice: 100000,
    endPrice: 200000,
  },
};

// Plan de 50 compras de 0.002 BTC cada una
// Tasa EUR/USD aproximada: 0.86
const EUR_USD_RATE = 0.86;
const BTC_PER_PURCHASE = 0.002;
const TOTAL_PURCHASES = 50;

// Fechas desde Feb 2026 hasta finales 2028 (~34 meses, cada ~21 días)
const START_DATE = new Date('2026-02-01');
const DAYS_BETWEEN = 21;

export const generatePurchasePlan = (type: PlanType = 'moderate'): Purchase[] => {
  const { startPrice, endPrice } = PLAN_DETAILS[type];
  const priceStep = (startPrice - endPrice) / (TOTAL_PURCHASES - 1);
  
  const purchases: Purchase[] = [];
  
  for (let i = 0; i < TOTAL_PURCHASES; i++) {
    const targetPrice = Math.round(startPrice - (priceStep * i));
    const estimatedCostUSD = targetPrice * BTC_PER_PURCHASE;
    const estimatedCostEUR = Math.round(estimatedCostUSD * EUR_USD_RATE * 100) / 100;
    
    const purchaseDate = new Date(START_DATE);
    purchaseDate.setDate(purchaseDate.getDate() + (i * DAYS_BETWEEN));
    
    purchases.push({
      id: i + 1,
      targetPrice,
      btcAmount: BTC_PER_PURCHASE,
      estimatedCostEUR,
      estimatedDate: purchaseDate.toISOString().split('T')[0],
      completed: false,
    });
  }
  
  return purchases;
};

export const TOTAL_BTC_GOAL = 0.1;
export const TOTAL_PURCHASES_COUNT = TOTAL_PURCHASES;
