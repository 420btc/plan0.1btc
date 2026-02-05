import { Bitcoin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onReset: () => void;
}

export const Header = ({ onReset }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-bitcoin rounded-xl shadow-glow">
          <Bitcoin className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">BTC Tracker</h1>
          <p className="text-sm text-muted-foreground">Plan de Acumulación 0.1 BTC</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="text-muted-foreground hover:text-foreground"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Reiniciar
      </Button>
    </header>
  );
};
