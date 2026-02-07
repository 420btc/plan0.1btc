import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface DcaFlexibleProps {
  className?: string;
}

export const DcaFlexible = ({ className }: DcaFlexibleProps) => {
  const storageKey = 'btc-accumulation-dca-v1';
  const [annualBudget, setAnnualBudget] = useState('2400');
  const [volatilityWeight, setVolatilityWeight] = useState(40);

  useEffect(() => {
    const storedDca = localStorage.getItem(storageKey);
    if (storedDca) {
      const parsed = JSON.parse(storedDca);
      setAnnualBudget(parsed.annualBudget ?? '2400');
      setVolatilityWeight(parsed.volatilityWeight ?? 40);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        annualBudget,
        volatilityWeight,
      }),
    );
  }, [annualBudget, volatilityWeight]);

  const dcaRows = useMemo(() => {
    const totalAnnual = Number(annualBudget);
    const baseTotal = Number.isFinite(totalAnnual) ? totalAnnual : 0;
    const weightStrength = Math.max(0, Math.min(100, volatilityWeight)) / 100;
    const start = new Date();
    const months = Array.from({ length: 12 }, (_, i) => new Date(start.getFullYear(), start.getMonth() + i, 1));
    const weights = months.map((_, i) => {
      const wave = Math.sin((i / 12) * Math.PI * 2);
      const weight = 1 + wave * 0.6 * weightStrength;
      return Math.max(0.2, weight);
    });
    const totalWeight = weights.reduce((sum, value) => sum + value, 0);
    return months.map((date, index) => {
      const share = totalWeight > 0 ? weights[index] / totalWeight : 1 / 12;
      return {
        id: index,
        label: date.toLocaleString('es-ES', { month: 'short', year: 'numeric' }),
        amount: baseTotal * share,
        share,
      };
    });
  }, [annualBudget, volatilityWeight]);

  return (
    <div className={cn("bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50", className)}>
      <h2 className="text-lg md:text-xl font-semibold mb-4">DCA Flexible</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Presupuesto anual (EUR)</span>
          <Input
            type="number"
            value={annualBudget}
            onChange={(e) => setAnnualBudget(e.target.value)}
            min={0}
            step={50}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Peso por volatilidad</span>
            <span className="text-xs font-mono">{volatilityWeight}%</span>
          </div>
          <Slider
            value={[volatilityWeight]}
            onValueChange={(vals) => setVolatilityWeight(vals[0])}
            min={0}
            max={100}
            step={5}
          />
        </div>
      </div>
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mes</TableHead>
              <TableHead>Asignación</TableHead>
              <TableHead>EUR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dcaRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="capitalize">{row.label}</TableCell>
                <TableCell>{(row.share * 100).toFixed(1)}%</TableCell>
                <TableCell>€{row.amount.toFixed(0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
