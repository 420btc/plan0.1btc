import { useState, useEffect } from 'react';
import { Calculator, ArrowRightLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SatsConverterProps {
  currentPriceEUR: number | null;
}

export const SatsConverter = ({ currentPriceEUR }: SatsConverterProps) => {
  const [eurAmount, setEurAmount] = useState<string>('50');
  const [satsAmount, setSatsAmount] = useState<string>('');

  useEffect(() => {
    if (currentPriceEUR && eurAmount) {
      const eur = parseFloat(eurAmount);
      if (!isNaN(eur)) {
        const sats = (eur / currentPriceEUR) * 100000000;
        setSatsAmount(Math.floor(sats).toString());
      }
    }
  }, [currentPriceEUR, eurAmount]);

  const handleEurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEurAmount(e.target.value);
    if (currentPriceEUR) {
      const eur = parseFloat(e.target.value);
      if (!isNaN(eur)) {
        const sats = (eur / currentPriceEUR) * 100000000;
        setSatsAmount(Math.floor(sats).toString());
      } else {
        setSatsAmount('');
      }
    }
  };

  const handleSatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSatsAmount(e.target.value);
    if (currentPriceEUR) {
      const sats = parseFloat(e.target.value);
      if (!isNaN(sats)) {
        const eur = (sats / 100000000) * currentPriceEUR;
        setEurAmount(eur.toFixed(2));
      } else {
        setEurAmount('');
      }
    }
  };

  return (
    <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Calculadora Sats</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground ml-1">Euros (€)</label>
          <div className="relative">
            <Input
              type="number"
              value={eurAmount}
              onChange={handleEurChange}
              className="bg-black/20 border-white/10 text-lg font-mono pl-3 pr-8"
              placeholder="0.00"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <label className="text-xs text-muted-foreground ml-1">Satoshis (sats)</label>
          <div className="relative">
            <Input
              type="number"
              value={satsAmount}
              onChange={handleSatsChange}
              className="bg-black/20 border-white/10 text-lg font-mono pl-3 pr-12 text-primary"
              placeholder="0"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-sm font-bold">sats</span>
          </div>
        </div>
      </div>
    </div>
  );
};
