import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Newspaper } from "lucide-react";
import { Link } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  timestamp: string;
}

interface TrendingSymbol {
  symbol: string;
  name: string;
  change: number;
  volume: number;
  price: number;
  mentions: number;
}

interface EarningsEvent {
  symbol: string;
  name: string;
  date: string;
  time: 'pre' | 'post';
  expectedEPS: number;
}

export default function Markets() {
  const { data: news } = useQuery<NewsItem[]>({
    queryKey: ["/api/markets/news"],
  });

  const { data: trendingSymbols } = useQuery<TrendingSymbol[]>({
    queryKey: ["/api/markets/trending"],
  });

  const { data: earnings } = useQuery<EarningsEvent[]>({
    queryKey: ["/api/markets/earnings"],
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Markets</h1>
        </div>

        <Tabs defaultValue="news" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="news">
              <Newspaper className="h-4 w-4 mr-2" />
              News
            </TabsTrigger>
            <TabsTrigger value="earnings">
              <Calendar className="h-4 w-4 mr-2" />
              Earnings Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Market News */}
              <Card>
                <CardHeader>
                  <CardTitle>Market News</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      {news?.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <h3 className="font-medium mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {item.description}
                            </p>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{item.source}</span>
                              <span>{format(new Date(item.timestamp), "MMM d, h:mm a")}</span>
                            </div>
                          </a>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Trending Symbols */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Trending Symbols</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] pr-4">
                      <div className="space-y-2">
                        {trendingSymbols?.map((symbol) => (
                          <Link key={symbol.symbol} href={`/ticker/${symbol.symbol}`}>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                            >
                              <div>
                                <div className="font-medium">${symbol.symbol}</div>
                                <div className="text-sm text-muted-foreground">
                                  {symbol.name}
                                </div>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`font-medium ${
                                    symbol.change >= 0 ? "text-green-500" : "text-red-500"
                                  }`}
                                >
                                  {symbol.change >= 0 ? (
                                    <TrendingUp className="inline h-4 w-4 mr-1" />
                                  ) : (
                                    <TrendingDown className="inline h-4 w-4 mr-1" />
                                  )}
                                  {symbol.change}%
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {symbol.mentions} mentions
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Gainers & Losers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Top Gainers</h3>
                        <div className="space-y-2">
                          {trendingSymbols
                            ?.filter((s) => s.change > 0)
                            .slice(0, 5)
                            .map((symbol) => (
                              <div
                                key={symbol.symbol}
                                className="flex items-center justify-between p-2 rounded-lg border"
                              >
                                <span className="font-medium">${symbol.symbol}</span>
                                <span className="text-green-500">+{symbol.change}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Top Losers</h3>
                        <div className="space-y-2">
                          {trendingSymbols
                            ?.filter((s) => s.change < 0)
                            .slice(0, 5)
                            .map((symbol) => (
                              <div
                                key={symbol.symbol}
                                className="flex items-center justify-between p-2 rounded-lg border"
                              >
                                <span className="font-medium">${symbol.symbol}</span>
                                <span className="text-red-500">{symbol.change}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-6">
                    {earnings?.map((event) => (
                      <motion.div
                        key={event.symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-medium mr-2">${event.symbol}</span>
                            <span className="text-sm text-muted-foreground">
                              {event.name}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">
                              {format(new Date(event.date), "MMM d")}
                            </span>
                            <span className="text-muted-foreground ml-2">
                              {event.time === "pre" ? "Before Market" : "After Market"}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Expected EPS: ${event.expectedEPS.toFixed(2)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}