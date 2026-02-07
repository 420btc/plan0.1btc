import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface ScenarioSimulationProps {
  totalBtc: number;
  currentPriceEur: number | null;
  targetBtc: number;
}

export const ScenarioSimulation = ({ totalBtc, currentPriceEur, targetBtc }: ScenarioSimulationProps) => {
  const storageKey = 'btc-accumulation-scenario-v1';
  const [scenarioPreset, setScenarioPreset] = useState<'bear' | 'base' | 'bull'>('base');
  const [scenarioMultiplier, setScenarioMultiplier] = useState(1);

  const scenarioPresets = [
    { key: 'bear', label: 'Bajista', multiplier: 0.6 },
    { key: 'base', label: 'Base', multiplier: 1 },
    { key: 'bull', label: 'Alcista', multiplier: 1.6 },
  ] as const;

  useEffect(() => {
    const storedScenario = localStorage.getItem(storageKey);
    if (storedScenario) {
      const parsed = JSON.parse(storedScenario);
      setScenarioPreset(parsed.scenarioPreset ?? 'base');
      setScenarioMultiplier(parsed.scenarioMultiplier ?? 1);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        scenarioPreset,
        scenarioMultiplier,
      }),
    );
  }, [scenarioMultiplier, scenarioPreset]);

  const priceEur = currentPriceEur ?? 0;
  const projectedPriceEur = priceEur * scenarioMultiplier;
  const projectedCurrentValueEur = totalBtc * projectedPriceEur;
  const projectedTargetValueEur = targetBtc * projectedPriceEur;

  const handleScenarioPreset = (preset: 'bear' | 'base' | 'bull') => {
    const selected = scenarioPresets.find(p => p.key === preset);
    if (!selected) return;
    setScenarioPreset(preset);
    setScenarioMultiplier(selected.multiplier);
  };

  return (
    <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Simulación por Escenarios</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {scenarioPresets.map((preset) => (
          <Button
            key={preset.key}
            variant={scenarioPreset === preset.key ? "default" : "outline"}
            size="sm"
            onClick={() => handleScenarioPreset(preset.key)}
            className="h-7 px-3 text-xs"
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Multiplicador</span>
          <span className="font-mono font-semibold">{scenarioMultiplier.toFixed(2)}x</span>
        </div>
        <Slider
          value={[scenarioMultiplier]}
          onValueChange={(vals) => {
            setScenarioPreset('base');
            setScenarioMultiplier(vals[0]);
          }}
          min={0.4}
          max={2.2}
          step={0.05}
        />
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <p className="text-xs text-muted-foreground mb-1">Precio BTC (EUR)</p>
            <p className="text-lg font-bold font-mono">€{projectedPriceEur.toFixed(0)}</p>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <p className="text-xs text-muted-foreground mb-1">Valor actual</p>
            <p className="text-lg font-bold font-mono">€{projectedCurrentValueEur.toFixed(0)}</p>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <p className="text-xs text-muted-foreground mb-1">Meta {targetBtc} BTC</p>
            <p className="text-lg font-bold font-mono">€{projectedTargetValueEur.toFixed(0)}</p>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <p className="text-xs text-muted-foreground mb-1">Diferencia</p>
            <p className="text-lg font-bold font-mono">€{(projectedTargetValueEur - projectedCurrentValueEur).toFixed(0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
