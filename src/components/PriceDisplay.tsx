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
    <div className="space-y-2 md:space-y-4">
      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
        <span className="text-3xl md:text-5xl font-bold font-mono text-gradient-bitcoin break-all md:break-normal">
          ${price?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <div className={cn(
          "flex items-center gap-1 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-medium w-fit",
          isPositive ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
        )}>
          {isPositive ? <TrendingUp className="h-3 w-3 md:h-4 md:w-4" /> : <TrendingDown className="h-3 w-3 md:h-4 md:w-4" />}
          {change24h?.toFixed(2)}%
        </div>
      </div>
      
      <div className="text-xl md:text-2xl text-muted-foreground font-mono">
        €{priceEUR?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  );
};
