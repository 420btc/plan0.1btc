import { Bitcoin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onReset: () => void;
}

export const Header = ({ onReset }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between py-4 md:py-6">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="p-1.5 md:p-2 bg-gradient-bitcoin rounded-xl shadow-glow">
          <Bitcoin className="h-6 w-6 md:h-8 md:w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold">BTC Tracker</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Plan de Acumulación 0.1 BTC</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onReset}
        className="text-muted-foreground hover:text-foreground text-xs md:text-sm px-2 md:px-3"
      >
        <RefreshCw className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
        Reiniciar
      </Button>
    </header>
  );
};
