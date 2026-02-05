import { TrendingUp, TrendingDown, DollarSign, Percent, Wallet, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortfolioStatsProps {
  totalBtc: number;
  totalInvestedEUR: number;
  currentBtcPriceEUR: number | null;
}

export const PortfolioStats = ({ totalBtc, totalInvestedEUR, currentBtcPriceEUR }: PortfolioStatsProps) => {
  const currentValueEUR = totalBtc * (currentBtcPriceEUR || 0);
  const pnlEUR = currentValueEUR - totalInvestedEUR;
  const pnlPercent = totalInvestedEUR > 0 ? (pnlEUR / totalInvestedEUR) * 100 : 0;
  const averageBuyPrice = totalBtc > 0 ? totalInvestedEUR / totalBtc : 0;
  const isProfitable = pnlEUR >= 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
      {/* Valor Actual */}
      <div className="bg-gradient-card rounded-xl p-3 md:p-4 border border-border/50 shadow-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Wallet className="h-8 w-8 md:h-12 md:w-12" />
        </div>
        <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Valor Cartera</p>
        <div className="text-lg md:text-2xl font-bold font-mono text-foreground">
          €{currentValueEUR.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* PnL (Ganancia/Pérdida) */}
      <div className={cn(
        "bg-gradient-card rounded-xl p-3 md:p-4 border shadow-card relative overflow-hidden group transition-colors duration-300",
        isProfitable ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"
      )}>
        <div className={cn(
          "absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity",
          isProfitable ? "text-success" : "text-destructive"
        )}>
          {isProfitable ? <TrendingUp className="h-8 w-8 md:h-12 md:w-12" /> : <TrendingDown className="h-8 w-8 md:h-12 md:w-12" />}
        </div>
        <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">PnL Total</p>
        <div className={cn(
          "text-lg md:text-2xl font-bold font-mono flex items-center gap-1",
          isProfitable ? "text-success" : "text-destructive"
        )}>
          {isProfitable ? '+' : ''}€{pnlEUR.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* ROI % */}
      <div className="bg-gradient-card rounded-xl p-3 md:p-4 border border-border/50 shadow-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Percent className="h-8 w-8 md:h-12 md:w-12" />
        </div>
        <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Retorno (ROI)</p>
        <div className={cn(
          "text-lg md:text-2xl font-bold font-mono",
          isProfitable ? "text-success" : "text-destructive"
        )}>
          {pnlPercent.toFixed(2)}%
        </div>
      </div>

      {/* Precio Promedio */}
      <div className="bg-gradient-card rounded-xl p-3 md:p-4 border border-border/50 shadow-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <Scale className="h-8 w-8 md:h-12 md:w-12" />
        </div>
        <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Precio Promedio</p>
        <div className="text-lg md:text-2xl font-bold font-mono text-primary">
          €{averageBuyPrice.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
        </div>
      </div>
    </div>
  );
};
