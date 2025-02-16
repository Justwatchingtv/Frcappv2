import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

export function TrendingStocks() {
  const [trendingStocks, setTrendingStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrendingStocks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/markets/trending");
      const data = await response.json();

      if (data?.gainers) {
        const stocks = data.gainers.map((stock: any) => ({
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          changePercent: stock.change
        }));
        setTrendingStocks(stocks);
      }
    } catch (error) {
      console.error("Error fetching trending stocks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingStocks();
    const interval = setInterval(fetchTrendingStocks, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Stocks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[500px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </motion.div>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-2">
              {trendingStocks.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-between hover:bg-accent"
                    asChild
                  >
                    <a href={`/ticker/${stock.symbol}`}>
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">{stock.symbol}</span>
                        <span className="text-muted-foreground">{stock.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-primary">
                          ${stock.price}
                        </span>
                        <span
                          className={`text-sm ${
                            stock.changePercent > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </a>
                  </Button>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}