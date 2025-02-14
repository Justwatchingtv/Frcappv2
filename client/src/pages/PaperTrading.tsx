import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { ArrowLeft, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { PaperTradingLeaderboard } from "@/components/PaperTradingLeaderboard";

interface TradeForm {
  symbol: string;
  amount: number;
  type: 'call' | 'put';
  expiry: string;
  strike: number;
}

interface Position {
  id: number;
  symbol: string;
  optionType: 'call' | 'put';
  quantity: number;
  entryPrice: number;
  strikePrice: number;
  expiryDate: string;
  status: 'open' | 'closed';
  pnl: number;
  riskLevel: string;
}

interface Account {
  balance: number;
  totalPnl: number;
  dailyPnl: number;
}

export default function PaperTrading() {
  const { toast } = useToast();
  const [position, setPosition] = useState<Position | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<string | null>(null);

  const { data: account, isLoading: isLoadingAccount } = useQuery<Account>({
    queryKey: ["/api/paper-trading/account"],
  });

  const { data: positions, isLoading: isLoadingPositions } = useQuery<Position[]>({
    queryKey: ["/api/paper-trading/positions"],
  });

  const tradeMutation = useMutation({
    mutationFn: async (data: TradeForm) => {
      const response = await fetch("/api/paper-trading/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Trade Executed",
        description: "Your paper trading position has been opened successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Trade Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<TradeForm>({
    defaultValues: {
      symbol: "",
      amount: 1000,
      type: 'call',
      expiry: "",
      strike: 0,
    },
  });

  const onSubmit = async (data: TradeForm) => {
    // Calculate max loss
    const maxLoss = data.type === 'call' ? data.amount : data.strike * 100;

    // Risk assessment
    const riskLevel = maxLoss > 5000 ? 'HIGH' : maxLoss > 2000 ? 'MEDIUM' : 'LOW';
    setRiskAssessment(`Risk Level: ${riskLevel} - Max Loss: $${maxLoss.toLocaleString()}`);

    try {
      await tradeMutation.mutateAsync(data);
    } catch (error) {
      console.error('Trade error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Paper Trading Simulator</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {/* Account Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${account?.balance.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total P&L</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${account?.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {account?.totalPnl >= 0 ? '+' : ''}${account?.totalPnl.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Daily P&L</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${account?.dailyPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {account?.dailyPnl >= 0 ? '+' : ''}${account?.dailyPnl.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trade Form and Positions */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Trade Form */}
              <Card>
                <CardHeader>
                  <CardTitle>New Trade</CardTitle>
                  <CardDescription>
                    Open a new paper trading position
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="symbol"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Symbol</FormLabel>
                            <FormControl>
                              <Input placeholder="AAPL" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount ($)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Option Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select option type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="call">Call</SelectItem>
                                <SelectItem value="put">Put</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="expiry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="strike"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Strike Price</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        {tradeMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <span className="animate-spin">↻</span>
                            Processing...
                          </div>
                        ) : (
                          "Place Trade"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Open Positions */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Open Positions</CardTitle>
                    <CardDescription>
                      Your active paper trading positions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {positions?.map((pos) => (
                        <div
                          key={pos.id}
                          className="flex items-center justify-between p-4 rounded-lg border"
                        >
                          <div>
                            <div className="font-medium">{pos.symbol}</div>
                            <div className="text-sm text-muted-foreground">
                              {pos.optionType.toUpperCase()} ${pos.strikePrice} {new Date(pos.expiryDate).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {pos.pnl >= 0 ? <TrendingUp className="inline h-4 w-4 mr-1" /> : <TrendingDown className="inline h-4 w-4 mr-1" />}
                              ${Math.abs(pos.pnl).toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Risk: {pos.riskLevel}
                            </div>
                          </div>
                        </div>
                      ))}

                      {positions?.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          No open positions
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {riskAssessment && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{riskAssessment}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="md:col-span-1">
            <PaperTradingLeaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}