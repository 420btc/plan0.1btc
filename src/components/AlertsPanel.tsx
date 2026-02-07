import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface AlertsPanelProps {
  currentPriceUsd: number | null;
}

export const AlertsPanel = ({ currentPriceUsd }: AlertsPanelProps) => {
  const alertsKey = 'btc-accumulation-alerts-v1';
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [alertPriceEnabled, setAlertPriceEnabled] = useState(true);
  const [alertDateEnabled, setAlertDateEnabled] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState('60000');
  const [alertTargetDate, setAlertTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [alertEmail, setAlertEmail] = useState('');

  useEffect(() => {
    const storedAlerts = localStorage.getItem(alertsKey);
    if (storedAlerts) {
      const parsed = JSON.parse(storedAlerts);
      setAlertsEnabled(Boolean(parsed.alertsEnabled));
      setAlertPriceEnabled(Boolean(parsed.alertPriceEnabled));
      setAlertDateEnabled(Boolean(parsed.alertDateEnabled));
      setAlertTargetPrice(parsed.alertTargetPrice ?? '60000');
      setAlertTargetDate(parsed.alertTargetDate ?? new Date().toISOString().split('T')[0]);
      setAlertEmail(parsed.alertEmail ?? '');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      alertsKey,
      JSON.stringify({
        alertsEnabled,
        alertPriceEnabled,
        alertDateEnabled,
        alertTargetPrice,
        alertTargetDate,
        alertEmail,
      }),
    );
  }, [alertsEnabled, alertDateEnabled, alertEmail, alertPriceEnabled, alertTargetDate, alertTargetPrice]);

  const alertPriceValue = Number(alertTargetPrice);
  const alertDateValue = new Date(alertTargetDate);
  const priceAlertTriggered = alertPriceEnabled && currentPriceUsd !== null && currentPriceUsd !== undefined
    ? currentPriceUsd <= alertPriceValue
    : false;
  const dateAlertTriggered = alertDateEnabled
    ? alertDateValue <= new Date()
    : false;

  return (
    <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Alertas</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Activar alertas</span>
          <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Precio objetivo (USD)</span>
              <Switch checked={alertPriceEnabled} onCheckedChange={setAlertPriceEnabled} />
            </div>
            <Input
              type="number"
              value={alertTargetPrice}
              onChange={(e) => setAlertTargetPrice(e.target.value)}
              disabled={!alertsEnabled || !alertPriceEnabled}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Fecha objetivo</span>
              <Switch checked={alertDateEnabled} onCheckedChange={setAlertDateEnabled} />
            </div>
            <Input
              type="date"
              value={alertTargetDate}
              onChange={(e) => setAlertTargetDate(e.target.value)}
              disabled={!alertsEnabled || !alertDateEnabled}
            />
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Email para avisos</span>
          <Input
            type="email"
            value={alertEmail}
            onChange={(e) => setAlertEmail(e.target.value)}
            placeholder="tu@email.com"
            disabled={!alertsEnabled}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <p className="text-xs text-muted-foreground mb-1">Estado precio</p>
            <p className={`text-sm font-semibold ${priceAlertTriggered ? 'text-success' : 'text-muted-foreground'}`}>
              {priceAlertTriggered ? 'Alcanzado' : 'En espera'}
            </p>
          </div>
          <div className="bg-black/20 p-3 rounded-xl border border-white/5">
            <p className="text-xs text-muted-foreground mb-1">Estado fecha</p>
            <p className={`text-sm font-semibold ${dateAlertTriggered ? 'text-success' : 'text-muted-foreground'}`}>
              {dateAlertTriggered ? 'Vencida' : 'En espera'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
