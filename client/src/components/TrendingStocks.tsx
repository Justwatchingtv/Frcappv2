import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrendingUp, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

// Define the type for stock data
interface Stock {
  symbol: string;
  name: string;
  price: number | null;
  changePercent: number | null;
  exchange: string;
}

export function TrendingStocks() {
  const [trendingStocks, setTrendingStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  const [newsLoading, setNewsLoading] = useState(false);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


const fetchTrendingStocks = async () => {
  setLoading(true);
  try {
    const response = await fetch(
      "https://yahoo-finance15.p.rapidapi.com/api/v2/markets/tickers?page=1&type=STOCKS",
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com",
          "x-rapidapi-key": "e6028ca7e1mshcedd69de9360a63p107b54jsnb7ab54c32578",
        },
      }
    );

    const data = await response.json();
    console.log("Trending Stocks Response:", data);

    if (data?.body) {
      const stocks = data.body.map((stock: any) => ({
        symbol: stock.symbol || "N/A",
        name: stock.name || "Unknown",
        price: stock.lastsale ? parseFloat(stock.lastsale.replace("$", "")) : null,
        changePercent: stock.pctchange
          ? parseFloat(stock.pctchange.replace("%", ""))
          : null,
        exchange: "Unknown", // Exchange info isn't provided in the response.
      }));
      setTrendingStocks(stocks);
    } else {
      console.warn("No trending stocks data available.");
    }
  } catch (error) {
    const errorMessage = (error as Error).message || "An unknown error occurred.";
    console.error("Error fetching trending stocks:", errorMessage);
  } finally {
    setLoading(false);
  }
};




const fetchNews = async (symbol: string) => {
  setNewsLoading(true);
  try {
    const response = await fetch(
      `https://api.tickertick.com/feed?q=tt:${symbol.toLowerCase()}&n=5`
    );

    const data = await response.json();
    console.log(`News for ${symbol}:`, data);

    if (data?.stories) {
      const newsArticles = data.stories.map((story: any) => ({
        id: story.id || Math.random(),
        title: story.title || "No Title",
        description: story.description || "No Description",
        url: story.url || "#",
        date: story.time
          ? new Date(story.time).toLocaleDateString()
          : "Unknown Date",
      }));
      setNews(newsArticles);
    } else {
      console.warn(`No news found for ${symbol}.`);
      setNews([]);
    }
  } catch (error) {
    const errorMessage = (error as Error).message || "An unknown error occurred.";
    console.error("Error fetching news:", errorMessage);
    setNews([
      {
        id: 1,
        title: "Error fetching news",
        description: "Please try again later.",
        url: "#",
        date: new Date().toLocaleDateString(),
      },
    ]);
  } finally {
    setNewsLoading(false);
  }
};




  const handleStockClick = async (symbol: string) => {
    setSelectedStock(symbol);
    setNewsDialogOpen(true);
    console.log("Fetching news for", symbol);
    await fetchNews(symbol);
  };

  useEffect(() => {
    fetchTrendingStocks();
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
                    onClick={() => handleStockClick(stock.symbol)}
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">{stock.symbol}</span>
                      <span className="text-muted-foreground">{stock.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-primary">
                        {stock.price !== null ? `$${stock.price}` : "N/A"}
                      </span>
                      <span
                        className={`text-sm ${
                          stock.changePercent !== null && stock.changePercent > 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {stock.changePercent !== null
                          ? `${stock.changePercent.toFixed(2)}%`
                          : ""}
                      </span>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>

      <Dialog open={newsDialogOpen} onOpenChange={setNewsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              {selectedStock} News
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            {newsLoading ? (
              <div className="flex items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </motion.div>
              </div>
            ) : (
              <div className="space-y-4">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.date}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="ml-2 flex-shrink-0"
                      >
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
