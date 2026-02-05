import { Header } from '@/components/Header';
import { PriceDisplay } from '@/components/PriceDisplay';
import { PriceChart } from '@/components/PriceChart';
import { ProgressCard } from '@/components/ProgressCard';
import { PurchaseList } from '@/components/PurchaseList';
import { Countdown } from '@/components/Countdown';
import { useBitcoinPrice } from '@/hooks/useBitcoinPrice';
import { usePurchases } from '@/hooks/usePurchases';
import { TOTAL_BTC_GOAL, TOTAL_PURCHASES_COUNT, PLAN_DETAILS, PlanType } from '@/data/purchasePlan';
import { Activity, CalendarClock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { priceData, priceHistory, isLoading, error } = useBitcoinPrice();
  const { 
    purchases, 
    togglePurchase, 
    resetPlan,
    currentPlanType,
    completedCount,
    totalBtcAccumulated,
    progressPercentage,
    totalSpentEUR,
  } = usePurchases();

  const nextPurchase = purchases.find(p => !p.completed);
  const buyZones = purchases
    .filter(p => !p.completed)
    .slice(0, 3) // Show next 3 buy zones
    .map(p => p.targetPrice);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full">
      {/* Background glow effect */}
      <div className="fixed inset-0 bg-gradient-glow pointer-events-none" />
      
      <div className="relative container max-w-6xl mx-auto px-2 md:px-4 pb-8">
        <Header onReset={() => resetPlan(currentPlanType)} />

        <div className="mb-6 md:mb-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {(Object.entries(PLAN_DETAILS) as [PlanType, typeof PLAN_DETAILS['moderate']][]).map(([key, detail]) => {
            const isSelected = currentPlanType === key;
            return (
              <button
                key={key}
                onClick={() => resetPlan(key)}
                className={`
                  relative overflow-hidden rounded-xl p-3 md:p-4 text-left transition-all duration-300 border
                  ${isSelected 
                    ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(234,179,8,0.2)]' 
                    : 'bg-card/50 border-white/5 hover:border-white/10 hover:bg-card'
                  }
                `}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity duration-300 ${isSelected ? 'opacity-100' : ''}`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-1.5 md:mb-2">
                    <span className={`text-base md:text-lg font-bold tracking-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {detail.name}
                    </span>
                    {isSelected && (
                      <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
                    )}
                  </div>
                  <p className="text-[10px] md:text-xs text-muted-foreground font-mono leading-relaxed">
                    {detail.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
          {/* Left column - Price & Chart */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6 min-w-0">
            {/* Live Price Card */}
            <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Bitcoin en Tiempo Real</h2>
                <span className="relative flex h-2 w-2 ml-auto">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
              </div>
              
              <PriceDisplay
                price={priceData?.price ?? null}
                priceEUR={priceData?.priceEUR ?? null}
                change24h={priceData?.change24h ?? null}
                isLoading={isLoading}
                error={error}
              />
            </div>

             {/* Countdown Card */}
             {nextPurchase && (
              <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarClock className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Próxima Compra</h2>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-1">Objetivo</div>
                  <div className="text-2xl font-mono font-bold text-white">
                    ${nextPurchase.targetPrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Estimado: {new Date(nextPurchase.estimatedDate).toLocaleDateString()}
                  </div>
                </div>
                <Countdown targetDate={nextPurchase.estimatedDate} />
              </div>
            )}

            {/* Chart Card */}
            <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50">
              <h2 className="text-lg font-semibold mb-4">Últimas 24 horas</h2>
              <PriceChart data={priceHistory} buyZones={buyZones} />
            </div>

            {/* Progress Card */}
            <ProgressCard
              completedCount={completedCount}
              totalCount={TOTAL_PURCHASES_COUNT}
              totalBtcAccumulated={totalBtcAccumulated}
              targetBtc={TOTAL_BTC_GOAL}
              progressPercentage={progressPercentage}
              totalSpentEUR={totalSpentEUR}
            />
          </div>

          {/* Right column - Purchase List */}
          <div className="lg:col-span-3 min-w-0">
            <div className="bg-gradient-card rounded-2xl p-4 md:p-6 shadow-card border border-border/50">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Plan de Compras ({PLAN_DETAILS[currentPlanType].name})</h2>
              <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
                50 compras de 0.002 BTC cada una. {PLAN_DETAILS[currentPlanType].description}.
              </p>
              
              <PurchaseList
                purchases={purchases}
                currentPrice={priceData?.price ?? null}
                onToggle={togglePurchase}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
