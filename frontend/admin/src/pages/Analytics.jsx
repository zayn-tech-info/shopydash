import { useEffect, useState } from "react";
import useAnalyticsStore from "../stores/analyticsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency } from "../utils/formatters";
import { Info } from "lucide-react";

 
function SimpleBarChart({ data, dataKey, color = "#6366f1", formatValue }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-gray-400 py-8 text-center">No data available</p>;
  }

  const maxVal = Math.max(...data.map((d) => d[dataKey] || 0), 1);

  return (
    <div className="space-y-2">
      {data.map((item, i) => {
        const val = item[dataKey] || 0;
        const pct = (val / maxVal) * 100;
        return (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="w-20 text-xs text-gray-500 shrink-0 text-right">
              {item.date?.slice(5) || item.fullName || item.businessName || item.storeName || `#${i + 1}`}
            </span>
            <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: color }}
              />
            </div>
            <span className="w-20 text-xs font-medium text-gray-700 shrink-0">
              {formatValue ? formatValue(val) : val}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function Analytics() {
  const {
    signups,
    orders,
    topVendors,
    revenue,
    loading,
    fetchSignups,
    fetchOrderAnalytics,
    fetchTopVendors,
    fetchRevenue,
  } = useAnalyticsStore();

  const [days, setDays] = useState("30");

  useEffect(() => {
    fetchSignups(Number(days));
    fetchOrderAnalytics(Number(days));
    fetchTopVendors(10);
    fetchRevenue(Number(days));
  }, [days, fetchSignups, fetchOrderAnalytics, fetchTopVendors, fetchRevenue]);

  return (
    <TooltipProvider delayDuration={200}>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">
              Platform performance overview
            </p>
          </div>
          <Tabs value={days} onValueChange={setDays}>
          <TabsList>
            <TabsTrigger value="7">7D</TabsTrigger>
            <TabsTrigger value="14">14D</TabsTrigger>
            <TabsTrigger value="30">30D</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Daily Signups */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Daily Signups
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Info size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  Number of new buyer accounts created per day. The date shows MM-DD format, and the number indicates total new registrations.
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <SimpleBarChart
                data={signups}
                dataKey="clients"
                label="Clients"
                color="#6366f1"
              />
            )}
          </CardContent>
        </Card>

        {/* Daily Orders */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Daily Orders
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Info size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  Total orders placed per day across all vendors. Shows order volume trends to identify peak shopping days.
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <SimpleBarChart
                data={orders}
                dataKey="orders"
                label="Orders"
                color="#06b6d4"
              />
            )}
          </CardContent>
        </Card>

        {/* Daily Revenue */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Daily Commission (Platform Fee)
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Info size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  Platform revenue from transaction fees collected per day. This is the commission earned from completed orders.
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <SimpleBarChart
                data={revenue}
                dataKey="commission"
                label="Commission"
                color="#10b981"
                formatValue={formatCurrency}
              />
            )}
          </CardContent>
        </Card>

        {/* Top Vendors */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Top Vendors by Revenue
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Info size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  Ranking of best-performing vendors by total sales revenue. Shows vendor name/store and their earnings.
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[200px] w-full" />
            ) : (
              <SimpleBarChart
                data={topVendors}
                dataKey="totalRevenue"
                label="Revenue"
                color="#a855f7"
                formatValue={formatCurrency}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </TooltipProvider>
  );
}
