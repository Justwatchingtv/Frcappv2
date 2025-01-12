import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, ThumbsUp, ThumbsDown } from "lucide-react";
import { Link, useRoute } from "wouter";

interface CompanyData {
  name: string;
  description: string;
  sector: string;
  industry: string;
  employees: number;
  ceo: string;
  website: string;
}

interface FundamentalsData {
  marketCap: number;
  peRatio: number;
  eps: number;
  dividend: number;
  beta: number;
  avgVolume: number;
}

interface EarningsData {
  date: string;
  expectedEPS: number;
  actualEPS: number;
  surprise: number;
}

export default function TickerView() {
  const [_, params] = useRoute("/ticker/:symbol");
  const symbol = params?.symbol?.toUpperCase() || "";
  const [sentiment, setSentiment] = useState<"bullish" | "bearish" | null>(null);

  const { data: companyData } = useQuery<CompanyData>({
    queryKey: [`/api/ticker/${symbol}/info`],
  });

  const { data: fundamentals } = useQuery<FundamentalsData>({
    queryKey: [`/api/ticker/${symbol}/fundamentals`],
  });

  const { data: earnings } = useQuery<EarningsData[]>({
    queryKey: [`/api/ticker/${symbol}/earnings`],
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/markets">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">${symbol}</h1>
            <p className="text-lg text-muted-foreground">{companyData?.name}</p>
          </div>
        </div>

        <Tabs defaultValue="bio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bio">Biography</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
          </TabsList>

          <TabsContent value="bio">
            <Card>
              <CardHeader>
                <CardTitle>Company Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-7">{companyData?.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Sector</p>
                    <p className="text-muted-foreground">{companyData?.sector}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Industry</p>
                    <p className="text-muted-foreground">{companyData?.industry}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">CEO</p>
                    <p className="text-muted-foreground">{companyData?.ceo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Employees</p>
                    <p className="text-muted-foreground">{companyData?.employees?.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chart">
            <Card>
              <CardContent className="pt-6">
                <div className="h-[600px]">
                  <iframe
                    key={symbol}
                    src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${symbol}&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&hideideas=1&theme=Dark&style=1&timezone=exchange&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=&utm_medium=widget&utm_campaign=chart`}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment">
            <Card>
              <CardHeader>
                <CardTitle>Market Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-6">
                  <p className="text-lg">What's your outlook on ${symbol}?</p>
                  <div className="flex gap-4">
                    <Button
                      size="lg"
                      variant={sentiment === "bullish" ? "default" : "outline"}
                      className="w-40"
                      onClick={() => setSentiment("bullish")}
                    >
                      <ThumbsUp className="mr-2 h-5 w-5" />
                      Bullish
                    </Button>
                    <Button
                      size="lg"
                      variant={sentiment === "bearish" ? "default" : "outline"}
                      className="w-40"
                      onClick={() => setSentiment("bearish")}
                    >
                      <ThumbsDown className="mr-2 h-5 w-5" />
                      Bearish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Earnings History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earnings?.map((quarter) => (
                    <div
                      key={quarter.date}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div>
                        <div className="font-medium">
                          {new Date(quarter.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Expected: ${quarter.expectedEPS.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          quarter.surprise >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {quarter.surprise >= 0 ? (
                            <TrendingUp className="inline h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="inline h-4 w-4 mr-1" />
                          )}
                          Actual: ${quarter.actualEPS.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.abs(quarter.surprise)}% {quarter.surprise >= 0 ? 'Beat' : 'Miss'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fundamentals">
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm font-medium">Market Cap</p>
                    <p className="text-2xl">${fundamentals ? (fundamentals.marketCap / 1e9).toFixed(2) : '-'}B</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">P/E Ratio</p>
                    <p className="text-2xl">{fundamentals?.peRatio.toFixed(2) ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">EPS</p>
                    <p className="text-2xl">${fundamentals?.eps.toFixed(2) ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dividend Yield</p>
                    <p className="text-2xl">{fundamentals?.dividend.toFixed(2) ?? '-'}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Beta</p>
                    <p className="text-2xl">{fundamentals?.beta.toFixed(2) ?? '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Avg. Volume</p>
                    <p className="text-2xl">{fundamentals ? (fundamentals.avgVolume / 1e6).toFixed(2) : '-'}M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}