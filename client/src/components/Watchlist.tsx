
import { useState, useEffect } from "react";
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

  const fetchStockData = async (symbol: string) => {
    try {
      const response = await fetch(
        `https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/${symbol}`,
        {
          headers: {
            'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com',
            'X-RapidAPI-Key': 'e6028ca7e1mshcedd69de9360a63p107b54jsnb7ab54c32578'
          }
        }
      );
      
      const data = await response.json();
      if (data?.body?.[0]) {
        const stockData = data.body[0];
        return {
          symbol: symbol,
          currentPrice: parseFloat(stockData.regularMarketPrice),
          priceChange: parseFloat(stockData.regularMarketChange),
          percentChange: parseFloat(stockData.regularMarketChangePercent),
          afterHoursChange: stockData.postMarketChangePercent ? parseFloat(stockData.postMarketChangePercent) : 0,
        };
      }
      throw new Error('Invalid data received');
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
    }
  };

  const addToWatchlist = async () => {
    if (!newSymbol) return;
    
    const stockData = await fetchStockData(newSymbol.toUpperCase());
    if (stockData) {
      setWatchlist(prev => [...prev, stockData]);
      setNewSymbol("");
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(item => item.symbol !== symbol));
  };

  useEffect(() => {
    const updatePrices = async () => {
      const updatedData = await Promise.all(
        watchlist.map(item => fetchStockData(item.symbol))
      );
      setWatchlist(updatedData.filter((item): item is WatchlistItem => item !== null));
    };

    const interval = setInterval(updatePrices, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [watchlist.length]);

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
                  AH: {item.afterHoursChange.toFixed(2)}%
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
