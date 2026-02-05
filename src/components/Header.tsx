import { Bitcoin, RefreshCw, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRef } from 'react';

interface HeaderProps {
  onReset: () => void;
}

export const Header = ({ onReset }: HeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = localStorage.getItem('btc-accumulation-purchases-v5');
    if (!data) {
      toast.error('No hay datos para exportar');
      return;
    }
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `btc-plan-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Datos exportados correctamente');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        JSON.parse(content); // Validate JSON
        localStorage.setItem('btc-accumulation-purchases-v5', content);
        window.location.reload();
        toast.success('Datos importados correctamente');
      } catch (err) {
        toast.error('Error al importar el archivo: Formato inválido');
      }
    };
    reader.readAsText(file);
    // Reset value so same file can be selected again if needed
    event.target.value = '';
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between py-4 md:py-6 gap-4">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="application/json" 
        style={{ display: 'none' }}
      />

      <div className="flex items-center gap-2 md:gap-3">
        <div className="p-1.5 md:p-2 bg-gradient-bitcoin rounded-xl shadow-glow">
          <Bitcoin className="h-6 w-6 md:h-8 md:w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold">BTC Tracker</h1>
          <p className="text-xs md:text-sm text-muted-foreground">Plan de Acumulación 0.1 BTC</p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExport}
          className="text-muted-foreground hover:text-foreground text-xs md:text-sm px-2 md:px-3"
          title="Exportar copia de seguridad"
        >
          <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Exportar</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleImportClick}
          className="text-muted-foreground hover:text-foreground text-xs md:text-sm px-2 md:px-3"
          title="Importar copia de seguridad"
        >
          <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Importar</span>
        </Button>
        <div className="h-4 w-[1px] bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-muted-foreground hover:text-destructive text-xs md:text-sm px-2 md:px-3"
          title="Reiniciar plan"
        >
          <RefreshCw className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Reiniciar</span>
        </Button>
      </div>
    </header>
  );
};
