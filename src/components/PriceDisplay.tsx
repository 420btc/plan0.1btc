import { TrendingUp, TrendingDown, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number | null;
  priceEUR: number | null;
  change24h: number | null;
  isLoading: boolean;
  error: string | null;
}

export const PriceDisplay = ({ price, priceEUR, change24h, isLoading, error }: PriceDisplayProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-destructive">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  const isPositive = (change24h ?? 0) >= 0;

  return (
    <div className="space-y-4">
      <div className="flex items-baseline gap-4">
        <span className="text-5xl font-bold font-mono text-gradient-bitcoin">
          ${price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <div className={cn(
          "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
          isPositive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
        )}>
          {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {change24h?.toFixed(2)}%
        </div>
      </div>
      
      <div className="text-2xl text-muted-foreground font-mono">
        €{priceEUR?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  );
};
