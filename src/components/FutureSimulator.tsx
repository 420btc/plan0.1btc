import { useState } from 'react';
import { TrendingUp, Wallet } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface FutureSimulatorProps {
  currentPriceUSD: number | null;
  currentPriceEUR: number | null;
}

export const FutureSimulator = ({ currentPriceUSD, currentPriceEUR }: FutureSimulatorProps) => {
  const [projectedPrice, setProjectedPrice] = useState<number>(100000);
  
  const targetBtc = 0.1;
  const targetStackValue = targetBtc * projectedPrice;
  const liveTargetUSD = currentPriceUSD ? targetBtc * currentPriceUSD : null;
  const liveTargetEUR = currentPriceEUR ? targetBtc * currentPriceEUR : null;

  return (
    <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Simulador de Futuro</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Precio BTC Proyectado</span>
            <span className="text-lg font-bold font-mono text-primary">${projectedPrice.toLocaleString()}</span>
          </div>
          
          <Slider
            value={[projectedPrice]}
            onValueChange={(vals) => setProjectedPrice(vals[0])}
            min={50000}
            max={500000}
            step={5000}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>$50k</span>
            <span>$250k</span>
            <span>$500k</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-xs text-primary/80">Proyección (0.1 BTC)</span>
            </div>
            <div className="text-lg md:text-xl font-bold font-mono text-primary">
              ${Math.round(targetStackValue).toLocaleString()}
            </div>
            <div className="text-[10px] text-primary/60 mt-1">
              Potencial Total
            </div>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Wallet className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Costo 0.1 BTC (Live)</span>
            </div>
            <div className="text-lg md:text-xl font-bold font-mono">
              €{liveTargetEUR !== null ? Math.round(liveTargetEUR).toLocaleString('es-ES') : '---'}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">
              ${liveTargetUSD !== null ? Math.round(liveTargetUSD).toLocaleString('en-US') : '---'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
