import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Purchase } from '@/data/purchasePlan';

interface TaxesPanelProps {
  purchases: Purchase[];
  currentPriceEur: number | null;
}

export const TaxesPanel = ({ purchases, currentPriceEur }: TaxesPanelProps) => {
  const storageKey = 'btc-accumulation-tax-v1';
  const [taxRate, setTaxRate] = useState('19');
  const [feeRate, setFeeRate] = useState('0.2');

  useEffect(() => {
    const storedTax = localStorage.getItem(storageKey);
    if (storedTax) {
      const parsed = JSON.parse(storedTax);
      setTaxRate(parsed.taxRate ?? '19');
      setFeeRate(parsed.feeRate ?? '0.2');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        taxRate,
        feeRate,
      }),
    );
  }, [feeRate, taxRate]);

  const priceEur = currentPriceEur ?? 0;
  const taxRateValue = Number(taxRate);
  const feeRateValue = Number(feeRate);
  const completedPurchases = purchases.filter(p => p.completed);

  const taxRows = useMemo(() => {
    return completedPurchases.map((p) => {
      const cost = p.actualCostEUR ?? p.estimatedCostEUR;
      const currentValue = priceEur * p.btcAmount;
      const pnl = currentValue - cost;
      const taxable = Math.max(0, pnl);
      const tax = taxable * (Number.isFinite(taxRateValue) ? taxRateValue : 0) / 100;
      const fee = cost * (Number.isFinite(feeRateValue) ? feeRateValue : 0) / 100;
      const net = pnl - tax - fee;
      return {
        id: p.id,
        date: p.completedAt ? new Date(p.completedAt).toLocaleDateString() : '',
        cost,
        currentValue,
        pnl,
        tax,
        fee,
        net,
      };
    });
  }, [completedPurchases, feeRateValue, priceEur, taxRateValue]);

  const totals = taxRows.reduce(
    (acc, row) => {
      return {
        cost: acc.cost + row.cost,
        currentValue: acc.currentValue + row.currentValue,
        pnl: acc.pnl + row.pnl,
        tax: acc.tax + row.tax,
        fee: acc.fee + row.fee,
        net: acc.net + row.net,
      };
    },
    { cost: 0, currentValue: 0, pnl: 0, tax: 0, fee: 0, net: 0 },
  );

  return (
    <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Impuestos y PnL</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Impuesto sobre ganancias (%)</span>
          <Input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            min={0}
            step={0.5}
          />
        </div>
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Comisiones (%)</span>
          <Input
            type="number"
            value={feeRate}
            onChange={(e) => setFeeRate(e.target.value)}
            min={0}
            step={0.1}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
          <p className="text-xs text-muted-foreground mb-1">Invertido</p>
          <p className="text-base font-bold font-mono">€{totals.cost.toFixed(0)}</p>
        </div>
        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
          <p className="text-xs text-muted-foreground mb-1">PnL</p>
          <p className="text-base font-bold font-mono">€{totals.pnl.toFixed(0)}</p>
        </div>
        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
          <p className="text-xs text-muted-foreground mb-1">Impuestos</p>
          <p className="text-base font-bold font-mono">€{totals.tax.toFixed(0)}</p>
        </div>
        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
          <p className="text-xs text-muted-foreground mb-1">Comisiones</p>
          <p className="text-base font-bold font-mono">€{totals.fee.toFixed(0)}</p>
        </div>
        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
          <p className="text-xs text-muted-foreground mb-1">Neto</p>
          <p className="text-base font-bold font-mono">€{totals.net.toFixed(0)}</p>
        </div>
      </div>
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Coste</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>PnL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {taxRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground text-center">
                  No hay compras completadas
                </TableCell>
              </TableRow>
            ) : (
              taxRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>#{row.id}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>€{row.cost.toFixed(0)}</TableCell>
                  <TableCell>€{row.currentValue.toFixed(0)}</TableCell>
                  <TableCell className={row.pnl >= 0 ? 'text-success' : 'text-destructive'}>
                    €{row.pnl.toFixed(0)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
