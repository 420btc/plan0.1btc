import { useMemo } from 'react';
import { Purchase } from '@/data/purchasePlan';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { BarChart3 } from 'lucide-react';

interface MonthlyActivityProps {
  purchases: Purchase[];
}

interface MonthData {
  month: string;
  totalCost: number;
  btcAmount: number;
  count: number;
  completedCount: number;
  isFuture: boolean;
  purchases: Purchase[];
}

export const MonthlyActivity = ({ purchases }: MonthlyActivityProps) => {
  const monthlyData = useMemo(() => {
    const grouped = purchases.reduce((acc, purchase) => {
      const date = new Date(purchase.estimatedDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[key]) {
        acc[key] = {
          month: date.toLocaleString('es-ES', { month: 'short', year: '2-digit' }),
          totalCost: 0,
          btcAmount: 0,
          count: 0,
          completedCount: 0,
          isFuture: !purchase.completed,
          purchases: []
        };
      }
      
      const cost = purchase.completed 
        ? (purchase.actualCostEUR || purchase.estimatedCostEUR) 
        : purchase.estimatedCostEUR;
        
      acc[key].totalCost += cost;
      acc[key].btcAmount += purchase.btcAmount;
      acc[key].count += 1;
      if (purchase.completed) acc[key].completedCount += 1;
      acc[key].purchases.push(purchase);
      
      // Update future status: if any purchase in month is completed, it's not fully future
      if (purchase.completed) acc[key].isFuture = false;
      
      return acc;
    }, {} as Record<string, MonthData>);

    return Object.entries(grouped)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => ({
        ...value,
        id: key,
        // Status: 'completed' (all done), 'partial' (some done), 'future' (none done)
        status: value.completedCount === value.count ? 'completed' : value.completedCount > 0 ? 'partial' : 'future'
      }));
  }, [purchases]);

  const maxCost = Math.max(...monthlyData.map(d => d.totalCost));

  return (
    <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Actividad Mensual</h2>
        </div>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {monthlyData.map((data) => (
            <CarouselItem key={data.id} className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5">
              <div className="flex flex-col gap-3 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors h-full">
                <div className="h-32 flex items-end justify-center w-full bg-black/20 rounded-lg relative overflow-hidden">
                  <div 
                    className={`w-full mx-2 rounded-t-sm transition-all duration-500 ${
                      data.status === 'completed' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' :
                      data.status === 'partial' ? 'bg-orange-500/60' :
                      'bg-orange-500/20'
                    }`}
                    style={{ height: `${(data.totalCost / maxCost) * 100}%` }}
                  />
                  <div className="absolute bottom-0 w-full h-[1px] bg-white/10" />
                </div>
                
                <div className="text-center mt-auto">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                    {data.month}
                  </div>
                  <div className={`text-sm font-bold font-mono ${
                    data.status === 'future' ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    €{Math.round(data.totalCost)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {data.count} {data.count === 1 ? 'compra' : 'compras'}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0 h-8 w-8 border-white/10 hover:bg-white/5" />
          <CarouselNext className="static translate-y-0 h-8 w-8 border-white/10 hover:bg-white/5" />
        </div>
      </Carousel>
    </div>
  );
};
