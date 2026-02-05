import { Check, Bell, BellOff, Calendar, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Purchase } from '@/data/purchasePlan';
import { Button } from '@/components/ui/button';

interface PurchaseCardProps {
  purchase: Purchase;
  currentPrice: number | null;
  onToggle: (id: number, actualPrice?: number, actualCostEUR?: number) => void;
}

export const PurchaseCard = ({ purchase, currentPrice, onToggle }: PurchaseCardProps) => {
  const isPriceBelow = currentPrice !== null && currentPrice <= purchase.targetPrice;
  
  const handleToggle = () => {
    if (!purchase.completed && currentPrice) {
      const eurRate = 0.92; // Aproximación
      const actualCostEUR = currentPrice * purchase.btcAmount * eurRate;
      onToggle(purchase.id, currentPrice, actualCostEUR);
    } else {
      onToggle(purchase.id);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div
      className={cn(
        "relative rounded-xl p-4 transition-all duration-300 border",
        purchase.completed 
          ? "bg-success/10 border-success shadow-[0_0_15px_rgba(34,197,94,0.3)] scale-[1.02]" 
          : isPriceBelow
            ? "bg-primary/10 border-primary/50 animate-glow"
            : "bg-card border-border/50 hover:border-border",
      )}
    >
      {/* Alert badge */}
      {!purchase.completed && isPriceBelow && (
        <div className="absolute bottom-2 right-16 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse z-10">
          <Bell className="h-3 w-3" />
          ¡COMPRAR!
        </div>
      )}
      
      {/* Completed badge */}
      {purchase.completed && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-success text-success-foreground text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg border border-white/20 z-20 pointer-events-none transform backdrop-blur-md">
          <Check className="h-4 w-4" />
          COMPRADO
        </div>
      )}

      <div className={`flex items-start justify-between gap-4 ${purchase.completed ? 'opacity-50 blur-[0.5px]' : ''}`}>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              purchase.completed 
                ? "bg-success/20 text-success" 
                : "bg-muted text-muted-foreground"
            )}>
              #{purchase.id}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(purchase.estimatedDate)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ArrowDown className={cn(
              "h-4 w-4",
              isPriceBelow && !purchase.completed ? "text-primary" : "text-muted-foreground"
            )} />
            <span className={cn(
              "text-lg font-bold font-mono",
              isPriceBelow && !purchase.completed ? "text-primary" : ""
            )}>
              ${purchase.targetPrice.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              {purchase.btcAmount} BTC
            </span>
            <span className="text-muted-foreground">
              ~€{purchase.completed && purchase.actualCostEUR 
                ? purchase.actualCostEUR.toFixed(2)
                : purchase.estimatedCostEUR.toFixed(2)}
            </span>
          </div>

          {purchase.completed && purchase.actualPrice && (
            <p className="text-xs text-success">
              Comprado a ${purchase.actualPrice.toLocaleString()} el {formatDate(purchase.completedAt!)}
            </p>
          )}
        </div>

        <Button
          variant={purchase.completed ? "default" : "outline"}
          size="icon"
          onClick={handleToggle}
          className={cn(
            "shrink-0 transition-all",
            purchase.completed && "bg-success hover:bg-success/90 border-success"
          )}
        >
          {purchase.completed ? (
            <Check className="h-5 w-5" />
          ) : (
            <div className="h-5 w-5 rounded border-2 border-current" />
          )}
        </Button>
      </div>
    </div>
  );
};
