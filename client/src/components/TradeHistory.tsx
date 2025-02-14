
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Trade {
  id: number;
  symbol: string;
  side: 'buy' | 'sell';
  filledQuantity: number;
  totalQuantity: number;
  limitPrice: number;
  stopPrice?: number;
  trailAmount?: number;
  status: 'working' | 'filled' | 'canceled' | 'failed';
  timestamp: string;
}

export function TradeHistory() {
  // Mock data - in a real app, this would come from your API
  const trades: Trade[] = [
    {
      id: 1,
      symbol: "AAPL",
      side: "buy",
      filledQuantity: 100,
      totalQuantity: 100,
      limitPrice: 175.50,
      status: "filled",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      symbol: "TSLA",
      side: "sell",
      filledQuantity: 0,
      totalQuantity: 50,
      limitPrice: 240.00,
      status: "working",
      timestamp: new Date().toISOString(),
    },
  ];

  const filterTradesByStatus = (status: Trade['status']) => {
    return trades.filter(trade => trade.status === status);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="working">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="working">Working</TabsTrigger>
            <TabsTrigger value="filled">Filled</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
          {(['working', 'filled', 'canceled', 'failed'] as const).map((status) => (
            <TabsContent key={status} value={status}>
              <div className="space-y-2">
                {filterTradesByStatus(status).map((trade) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between p-2 rounded-lg border"
                  >
                    <div>
                      <div className="font-medium">{trade.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {trade.side.toUpperCase()} {trade.filledQuantity}/{trade.totalQuantity}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        ${trade.limitPrice.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(trade.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {filterTradesByStatus(status).length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    No {status} orders
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
