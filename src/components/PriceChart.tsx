import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface PriceHistory {
  time: string;
  price: number;
}

interface PriceChartProps {
  data: PriceHistory[];
  buyZones?: number[];
}

export const PriceChart = ({ data, buyZones = [] }: PriceChartProps) => {
  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        Cargando gráfico...
      </div>
    );
  }

  const prices = data.map(d => d.price);
  const allValues = [...prices, ...buyZones];
  
  // Calculate domain including buy zones to ensure they are visible if close
  const minPrice = Math.min(...allValues) * 0.995;
  const maxPrice = Math.max(...allValues) * 1.005;

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(33, 95%, 53%)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(33, 95%, 53%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={['auto', 'auto']}
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(220, 10%, 55%)', fontSize: 10 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(220, 18%, 12%)',
              border: '1px solid hsl(220, 15%, 25%)',
              borderRadius: '8px',
              color: 'hsl(40, 20%, 95%)',
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Precio']}
            labelStyle={{ color: 'hsl(220, 10%, 55%)' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="hsl(33, 95%, 53%)"
            strokeWidth={2}
            fill="url(#priceGradient)"
          />
          {buyZones.map((price, i) => (
             <ReferenceLine 
               key={i} 
               y={price} 
               stroke="rgba(255, 255, 255, 0.2)" 
               strokeDasharray="3 3"
               strokeWidth={1}
               label={{ 
                 value: `Compra ${i + 1}`, 
                 fill: 'rgba(255, 255, 255, 0.4)', 
                 fontSize: 10, 
                 position: 'right' 
               }} 
             />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
