import { useState, useEffect, useCallback } from 'react';
import { Purchase, generatePurchasePlan, TOTAL_BTC_GOAL, PlanType } from '@/data/purchasePlan';

const STORAGE_KEY = 'btc-accumulation-purchases-v5';
const PLAN_TYPE_KEY = 'btc-accumulation-plan-type-v5';

export const usePurchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [currentPlanType, setCurrentPlanType] = useState<PlanType>('moderate');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const storedType = localStorage.getItem(PLAN_TYPE_KEY) as PlanType;
    
    if (storedType) {
      setCurrentPlanType(storedType);
    }

    if (stored) {
      setPurchases(JSON.parse(stored));
    } else {
      const initialPlan = generatePurchasePlan(storedType || 'moderate');
      setPurchases(initialPlan);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialPlan));
    }
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

  const resetPlan = useCallback((type: PlanType = 'moderate') => {
    const newPlan = generatePurchasePlan(type);
    setCurrentPlanType(type);
    localStorage.setItem(PLAN_TYPE_KEY, type);
    savePurchases(newPlan);
  }, [savePurchases]);

  const completedCount = purchases.filter(p => p.completed).length;
  const totalBtcAccumulated = completedCount * 0.002;
  const progressPercentage = (totalBtcAccumulated / TOTAL_BTC_GOAL) * 100;
  const totalSpentEUR = purchases
    .filter(p => p.completed)
    .reduce((sum, p) => sum + (p.actualCostEUR || p.estimatedCostEUR), 0);

  return {
    purchases,
    togglePurchase,
    resetPlan,
    currentPlanType,
    completedCount,
    totalBtcAccumulated,
    progressPercentage,
    totalSpentEUR,
  };
};
