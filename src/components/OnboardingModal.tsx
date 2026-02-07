import { useEffect, useState } from 'react';
import { Activity, BarChart3, Bell, Calculator, LineChart, ListChecks } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ONBOARDING_KEY = 'btc-onboarding-v1';

const features = [
  {
    title: 'Precio en tiempo real',
    description: 'Sigue el valor de BTC al segundo con cambios y EUR/USD.',
    Icon: Activity,
  },
  {
    title: 'Plan de compras',
    description: 'Marca compras, controla progreso y objetivos de 0.1 BTC.',
    Icon: ListChecks,
  },
  {
    title: 'Simulador de futuro',
    description: 'Ajusta la proyección y estima el potencial de tu meta.',
    Icon: LineChart,
  },
  {
    title: 'Alertas inteligentes',
    description: 'Recibe señales cuando el precio entra en tu zona.',
    Icon: Bell,
  },
  {
    title: 'Calculadora sats',
    description: 'Convierte EUR o USD a satoshis con precio en vivo.',
    Icon: Calculator,
  },
  {
    title: 'Actividad mensual',
    description: 'Visualiza tu ritmo de compras y evolución por meses.',
    Icon: BarChart3,
  },
];

export const OnboardingModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) setOpen(true);
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      localStorage.setItem(ONBOARDING_KEY, 'seen');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl border border-border/60 bg-gradient-card p-0 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
        <div className="relative overflow-hidden rounded-lg p-6 md:p-8">
          <div className="absolute -top-24 right-4 h-48 w-48 rounded-full bg-primary/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-16 left-4 h-40 w-40 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,170,0,0.08),_transparent_60%)]" />

          <DialogHeader className="relative space-y-3 text-left">
            <DialogTitle className="text-2xl md:text-3xl font-bold">
              Bienvenido a tu plan 0.1 BTC
            </DialogTitle>
            <p className="text-sm md:text-base text-muted-foreground">
              Un recorrido rápido para entender las 6 funciones clave y empezar a usarlo al instante.
            </p>
          </DialogHeader>

          <div className="relative mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="group rounded-xl border border-white/10 bg-black/30 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-black/40"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="text-[10px] text-muted-foreground">
              Puedes cerrar este tutorial y volver cuando quieras.
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)} className="h-9 px-4">
                Ver más tarde
              </Button>
              <Button size="sm" onClick={() => handleOpenChange(false)} className="h-9 px-4">
                Empezar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
