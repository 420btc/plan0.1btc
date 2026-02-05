import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Timer } from 'lucide-react';

interface CountdownProps {
  targetDate?: string;
}

export const Countdown = ({ targetDate }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <Card className="bg-gradient-card border-none p-4 flex items-center justify-center gap-2 text-muted-foreground">
        <Timer className="h-4 w-4" />
        <span>Listo para comprar</span>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 text-center">
      <div className="bg-black/20 rounded-lg p-2 backdrop-blur-sm border border-white/5">
        <div className="text-2xl font-bold text-primary font-mono">{timeLeft.days}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Días</div>
      </div>
      <div className="bg-black/20 rounded-lg p-2 backdrop-blur-sm border border-white/5">
        <div className="text-2xl font-bold text-primary font-mono">{timeLeft.hours}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Hrs</div>
      </div>
      <div className="bg-black/20 rounded-lg p-2 backdrop-blur-sm border border-white/5">
        <div className="text-2xl font-bold text-primary font-mono">{timeLeft.minutes}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Min</div>
      </div>
      <div className="bg-black/20 rounded-lg p-2 backdrop-blur-sm border border-white/5">
        <div className="text-2xl font-bold text-primary font-mono">{timeLeft.seconds}</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Seg</div>
      </div>
    </div>
  );
};
