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
export type PurchaseCount = 25 | 50;

export const TOTAL_BTC_GOAL = 0.1;

export const PLAN_DETAILS: Record<PlanType, { name: string; description: string; startPrice: number; endPrice: number }> = {
  conservative: {
    name: 'Conservador',
    description: 'Entrada tardía (60k - 35k)',
    startPrice: 60000,
    endPrice: 35000,
  },
  moderate: {
    name: 'Moderado',
    description: 'Plan ajustado (65k - 40k)',
    startPrice: 65000,
    endPrice: 40000,
  },
  aggressive: {
    name: 'Agresivo',
    description: 'Acumulación intensa (65k - 45k)',
    startPrice: 65000,
    endPrice: 45000,
  },
};

const EUR_USD_RATE = 0.86;
export const PURCHASE_COUNTS: PurchaseCount[] = [50, 25];

export const getBtcPerPurchase = (purchaseCount: PurchaseCount) => {
  return Number((TOTAL_BTC_GOAL / purchaseCount).toFixed(6));
};

// Fechas desde Marzo 2026 hasta finales 2028 (~34 meses, cada ~21 días)
const START_DATE = new Date('2026-03-01');
const DAYS_BETWEEN = 21;

export const generatePurchasePlan = (type: PlanType = 'moderate', purchaseCount: PurchaseCount = 50): Purchase[] => {
  const { startPrice, endPrice } = PLAN_DETAILS[type];
  const btcPerPurchase = getBtcPerPurchase(purchaseCount);
  const priceStep = (startPrice - endPrice) / (purchaseCount - 1);
  
  const purchases: Purchase[] = [];
  
  for (let i = 0; i < purchaseCount; i++) {
    const targetPrice = Math.round(startPrice - (priceStep * i));
    const estimatedCostUSD = targetPrice * btcPerPurchase;
    const estimatedCostEUR = Math.round(estimatedCostUSD * EUR_USD_RATE * 100) / 100;
    
    const purchaseDate = new Date(START_DATE);
    purchaseDate.setDate(purchaseDate.getDate() + (i * DAYS_BETWEEN));
    
    purchases.push({
      id: i + 1,
      targetPrice,
      btcAmount: btcPerPurchase,
      estimatedCostEUR,
      estimatedDate: purchaseDate.toISOString().split('T')[0],
      completed: false,
    });
  }
  
  return purchases;
};
