import { useState } from 'react';
import { Purchase } from '@/data/purchasePlan';
import { PurchaseCard } from './PurchaseCard';
import { Button } from '@/components/ui/button';
import { Filter, List, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PurchaseListProps {
  purchases: Purchase[];
  currentPrice: number | null;
  onToggle: (id: number, actualPrice?: number, actualCostEUR?: number) => void;
}

type FilterType = 'all' | 'pending' | 'completed' | 'near';

export const PurchaseList = ({ purchases, currentPrice, onToggle }: PurchaseListProps) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const isNearTarget = (targetPrice: number) => {
    if (!currentPrice) return false;
    const diff = ((currentPrice - targetPrice) / targetPrice) * 100;
    return diff > 0 && diff <= 10;
  };

  const filteredPurchases = purchases.filter(p => {
    switch (filter) {
      case 'pending':
        return !p.completed;
      case 'completed':
        return p.completed;
      case 'near':
        return !p.completed && (isNearTarget(p.targetPrice) || (currentPrice !== null && currentPrice <= p.targetPrice));
      default:
        return true;
    }
  });

  const nearCount = purchases.filter(p => 
    !p.completed && currentPrice !== null && (isNearTarget(p.targetPrice) || currentPrice <= p.targetPrice)
  ).length;

  const filters: { key: FilterType; label: string; icon: React.ElementType; count?: number }[] = [
    { key: 'all', label: 'Todas', icon: List },
    { key: 'pending', label: 'Pendientes', icon: Clock, count: purchases.filter(p => !p.completed).length },
    { key: 'completed', label: 'Completadas', icon: CheckCircle, count: purchases.filter(p => p.completed).length },
    { key: 'near', label: 'Alertas', icon: AlertTriangle, count: nearCount },
  ];

  const firstPendingIndex = purchases.findIndex(p => !p.completed);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {filters.map(({ key, label, icon: Icon, count }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(key)}
            className={cn(
              "shrink-0 gap-2",
              filter === key && key === 'near' && nearCount > 0 && "bg-warning text-warning-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
            {count !== undefined && (
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-xs",
                filter === key 
                  ? "bg-primary-foreground/20" 
                  : "bg-muted"
              )}>
                {count}
              </span>
            )}
          </Button>
        ))}
      </div>

      <div className="space-y-3 max-h-[calc(100vh-300px)] min-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
        {filteredPurchases.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay compras en esta categoría</p>
          </div>
        ) : (
          filteredPurchases.map((purchase) => {
            const isFirstPending = purchase.id === purchases[firstPendingIndex]?.id;
            return (
              <PurchaseCard
                key={purchase.id}
                purchase={purchase}
                currentPrice={currentPrice}
                onToggle={onToggle}
                isFirstPending={isFirstPending}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
