import { useEffect, useState } from 'react';
import { Gauge } from 'lucide-react';

interface FNGData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update: string;
}

export const FearAndGreed = () => {
  const [data, setData] = useState<FNGData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFNG = async () => {
      try {
        const response = await fetch('https://api.alternative.me/fng/');
        const json = await response.json();
        if (json.data && json.data.length > 0) {
          setData(json.data[0]);
        }
      } catch (error) {
        console.error('Error fetching FNG:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFNG();
  }, []);

  const getValueColor = (value: number) => {
    if (value >= 75) return 'text-green-500'; // Extreme Greed
    if (value >= 55) return 'text-green-400'; // Greed
    if (value >= 45) return 'text-yellow-500'; // Neutral
    if (value >= 25) return 'text-orange-500'; // Fear
    return 'text-red-500'; // Extreme Fear
  };

  const getProgressColor = (value: number) => {
    if (value >= 75) return 'bg-green-500';
    if (value >= 55) return 'bg-green-400';
    if (value >= 45) return 'bg-yellow-500';
    if (value >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50 animate-pulse">
        <div className="h-6 w-32 bg-white/10 rounded mb-4"></div>
        <div className="h-12 w-full bg-white/5 rounded"></div>
      </div>
    );
  }

  const value = data ? parseInt(data.value) : 50;

  return (
    <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Sentimiento del Mercado</h2>
      </div>

      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative flex items-center justify-center w-full mb-2">
          <div className={`text-4xl font-bold font-mono ${getValueColor(value)}`}>
            {value}
          </div>
        </div>
        
        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          {data?.value_classification || 'Neutral'}
        </div>

        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden relative">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${getProgressColor(value)}`}
            style={{ width: `${value}%` }}
          />
        </div>
        
        <div className="flex justify-between w-full mt-2 text-[10px] text-muted-foreground uppercase">
          <span>Miedo Extremo</span>
          <span>Codicia Extrema</span>
        </div>
      </div>
    </div>
  );
};
