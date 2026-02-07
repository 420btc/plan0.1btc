import { useState, useEffect, useCallback } from 'react';
import { Purchase, generatePurchasePlan, TOTAL_BTC_GOAL, PlanType, PurchaseCount, getBtcPerPurchase } from '@/data/purchasePlan';

const STORAGE_KEY = 'btc-accumulation-purchases-v5';
const PLAN_TYPE_KEY = 'btc-accumulation-plan-type-v5';
const PLAN_COUNT_KEY = 'btc-accumulation-plan-count-v5';

export const usePurchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [currentPlanType, setCurrentPlanType] = useState<PlanType>('moderate');
  const [purchaseCount, setPurchaseCount] = useState<PurchaseCount>(50);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedType = localStorage.getItem(PLAN_TYPE_KEY) as PlanType;
    const storedCountRaw = Number(localStorage.getItem(PLAN_COUNT_KEY));
    const storedCount = storedCountRaw === 25 || storedCountRaw === 50 ? (storedCountRaw as PurchaseCount) : undefined;

    if (storedType) {
      setCurrentPlanType(storedType);
    }

    let parsedPurchases: Purchase[] | null = null;

    if (stored) {
      parsedPurchases = JSON.parse(stored);
      setPurchases(parsedPurchases);
    } else {
      const fallbackCount: PurchaseCount = storedCount || 50;
      const initialPlan = generatePurchasePlan(storedType || 'moderate', fallbackCount);
      setPurchases(initialPlan);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPlan));
    }

    const countFromData = parsedPurchases && (parsedPurchases.length === 25 || parsedPurchases.length === 50)
      ? (parsedPurchases.length as PurchaseCount)
      : undefined;
    const initialCount = storedCount || countFromData || 50;
    setPurchaseCount(initialCount);
    localStorage.setItem(PLAN_COUNT_KEY, String(initialCount));
  }, []);

  const savePurchases = useCallback((updated: Purchase[]) => {
    setPurchases(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const togglePurchase = useCallback((id: number, actualPrice?: number, actualCostEUR?: number) => {
    setPurchases(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          return {
            ...p,
            completed: !p.completed,
            completedAt: !p.completed ? new Date().toISOString() : undefined,
            actualPrice: !p.completed ? actualPrice : undefined,
            actualCostEUR: !p.completed ? actualCostEUR : undefined,
          };
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetPlan = useCallback((type: PlanType = 'moderate', count: PurchaseCount = purchaseCount) => {
    const newPlan = generatePurchasePlan(type, count);
    setCurrentPlanType(type);
    setPurchaseCount(count);
    localStorage.setItem(PLAN_TYPE_KEY, type);
    localStorage.setItem(PLAN_COUNT_KEY, String(count));
    savePurchases(newPlan);
  }, [purchaseCount, savePurchases]);

  const completedCount = purchases.filter(p => p.completed).length;
  const totalBtcAccumulated = purchases
    .filter(p => p.completed)
    .reduce((sum, p) => sum + p.btcAmount, 0);
  const progressPercentage = (totalBtcAccumulated / TOTAL_BTC_GOAL) * 100;
  const totalSpentEUR = purchases
    .filter(p => p.completed)
    .reduce((sum, p) => sum + (p.actualCostEUR || p.estimatedCostEUR), 0);
  const btcPerPurchase = getBtcPerPurchase(purchaseCount);

  return {
    purchases,
    togglePurchase,
    resetPlan,
    currentPlanType,
    purchaseCount,
    btcPerPurchase,
    completedCount,
    totalBtcAccumulated,
    progressPercentage,
    totalSpentEUR,
  };
};
