import { useState, useEffect } from 'react';
import { Hourglass } from 'lucide-react';

export const HalvingCountdown = () => {
  // Next Bitcoin Halving estimation: April 2028
  const targetDate = new Date('2028-04-15T00:00:00');
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +targetDate - +new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        years: Math.floor(difference / (1000 * 60 * 60 * 24) / 365)
      };
    }
    return { days: 0, hours: 0, years: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000 * 60 * 60); // Update every hour is enough for long term
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
      
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <Hourglass className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Próximo Halving</h2>
      </div>

      <div className="flex flex-col gap-4 relative z-10">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-black/20 rounded-lg p-2 border border-white/5">
            <div className="text-2xl font-bold font-mono text-primary">{timeLeft.years}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Años</div>
          </div>
          <div className="bg-black/20 rounded-lg p-2 border border-white/5">
            <div className="text-2xl font-bold font-mono text-white">{timeLeft.days % 365}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Días</div>
          </div>
          <div className="bg-black/20 rounded-lg p-2 border border-white/5">
            <div className="text-2xl font-bold font-mono text-white">{timeLeft.hours}</div>
            <div className="text-[10px] text-muted-foreground uppercase">Horas</div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed text-center">
          Se estima para <span className="text-primary font-semibold">Abril 2028</span>. 
          Tu plan de acumulación termina justo a tiempo para el próximo ciclo alcista.
        </p>
      </div>
    </div>
  );
};
