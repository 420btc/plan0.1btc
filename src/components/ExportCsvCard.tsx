import { Button } from '@/components/ui/button';
import { Purchase } from '@/data/purchasePlan';

interface ExportCsvCardProps {
  purchases: Purchase[];
  currentPriceEur: number | null;
}

export const ExportCsvCard = ({ purchases, currentPriceEur }: ExportCsvCardProps) => {
  const handleExportCsv = () => {
    const priceEur = currentPriceEur ?? 0;
    const escapeCsv = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const headers = [
      'id',
      'target_price_usd',
      'btc_amount',
      'estimated_cost_eur',
      'estimated_date',
      'completed',
      'completed_at',
      'actual_price_usd',
      'actual_cost_eur',
      'current_price_eur',
      'current_value_eur',
      'pnl_eur',
    ];
    const rows = purchases.map((p) => {
      const cost = p.actualCostEUR ?? p.estimatedCostEUR;
      const currentValue = priceEur * p.btcAmount;
      const pnl = currentValue - cost;
      return [
        p.id,
        p.targetPrice,
        p.btcAmount,
        p.estimatedCostEUR,
        p.estimatedDate,
        p.completed,
        p.completedAt ?? '',
        p.actualPrice ?? '',
        p.actualCostEUR ?? '',
        priceEur || '',
        currentValue,
        pnl,
      ].map(escapeCsv).join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `btc-plan-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Exportación</h2>
      <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
        <p className="text-xs md:text-sm text-muted-foreground">
          Descarga un CSV con costes, fechas, precios reales y PnL.
        </p>
        <Button onClick={handleExportCsv} size="sm" className="md:self-end">
          Descargar CSV
        </Button>
      </div>
    </div>
  );
};
