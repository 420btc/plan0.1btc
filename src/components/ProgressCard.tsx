import { Progress } from '@/components/ui/progress';
import { Bitcoin, Target, Wallet, TrendingUp } from 'lucide-react';

interface ProgressCardProps {
  completedCount: number;
  totalCount: number;
  totalBtcAccumulated: number;
  targetBtc: number;
  progressPercentage: number;
  totalSpentEUR: number;
}

export const ProgressCard = ({
  completedCount,
  totalCount,
  totalBtcAccumulated,
  targetBtc,
  progressPercentage,
  totalSpentEUR,
}: ProgressCardProps) => {
  return (
    <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="p-2 md:p-3 bg-gradient-bitcoin rounded-xl shadow-glow">
          <Target className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-lg md:text-xl font-semibold">Progreso del Plan</h2>
          <p className="text-xs md:text-sm text-muted-foreground">Objetivo: {targetBtc} BTC antes de 2029</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs md:text-sm text-muted-foreground mb-1">BTC Acumulados</p>
            <p className="text-2xl md:text-3xl font-bold font-mono text-gradient-bitcoin">
              {totalBtcAccumulated.toFixed(4)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs md:text-sm text-muted-foreground mb-1">Objetivo</p>
            <p className="text-lg md:text-xl font-semibold font-mono">{targetBtc}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={progressPercentage} className="h-2 md:h-3" />
          <p className="text-[10px] md:text-xs text-muted-foreground text-center">
            {progressPercentage.toFixed(1)}% completado
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Bitcoin className="h-3 w-3 md:h-4 md:w-4" />
            </div>
            <p className="text-base md:text-lg font-bold">{completedCount}/{totalCount}</p>
            <p className="text-[10px] md:text-xs text-muted-foreground">Compras</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Wallet className="h-3 w-3 md:h-4 md:w-4" />
            </div>
            <p className="text-base md:text-lg font-bold">€{totalSpentEUR.toFixed(0)}</p>
            <p className="text-[10px] md:text-xs text-muted-foreground">Invertido</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <TrendingUp className="h-3 w-3 md:h-4 md:w-4" />
            </div>
            <p className="text-base md:text-lg font-bold">{totalCount - completedCount}</p>
            <p className="text-[10px] md:text-xs text-muted-foreground">Restantes</p>
          </div>
        </div>
      </div>
    </div>
  );
};
