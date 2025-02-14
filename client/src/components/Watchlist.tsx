
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface WatchlistItem {
  symbol: string;
  currentPrice: number;
  priceChange: number;
  percentChange: number;
  afterHoursChange?: number;
}

export function Watchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [newSymbol, setNewSymbol] = useState("");

  const addToWatchlist = () => {
    if (!newSymbol) return;
    // In a real app, you would fetch the price data from an API
    const mockData: WatchlistItem = {
      symbol: newSymbol.toUpperCase(),
      currentPrice: 100 + Math.random() * 100,
      priceChange: (Math.random() - 0.5) * 10,
      percentChange: (Math.random() - 0.5) * 5,
      afterHoursChange: (Math.random() - 0.5) * 2,
    };
    setWatchlist([...watchlist, mockData]);
    setNewSymbol("");
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(item => item.symbol !== symbol));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add symbol (e.g. AAPL)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addToWatchlist()}
          />
          <Button onClick={addToWatchlist} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {watchlist.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between p-2 rounded-lg border"
            >
              <div>
                <div className="font-medium">{item.symbol}</div>
                <div className="text-sm text-muted-foreground">
                  ${item.currentPrice.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-sm ${
                    item.priceChange >= 0 ? "text-[#00C805]" : "text-[#FF333A]"
                  }`}
                >
                  {item.priceChange >= 0 ? "+" : ""}
                  {item.priceChange.toFixed(2)} ({item.percentChange.toFixed(2)}%)
                </div>
                <div className="text-xs text-muted-foreground">
                  AH: {item.afterHoursChange?.toFixed(2)}%
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromWatchlist(item.symbol)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
