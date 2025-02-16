import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OptionsChainSimulator } from "@/components/OptionsChainSimulator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { PaperTradingLeaderboard } from "@/components/PaperTradingLeaderboard";
import { Watchlist } from "@/components/Watchlist";
import { TradeHistory } from "@/components/TradeHistory";
import { StockChart } from "@/components/StockChart";
import { Toggle } from "@/components/ui/toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@radix-ui/react-dialog' // Or your UI library's Dialog components
import { Label } from '@radix-ui/react-label' // Or your UI library's Label component


interface TradeForm {
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  orderType: 'MARKET' | 'LIMIT';
  limitPrice?: number;
  timeInForce: 'DAY' | 'GTC';
  extendedHours: boolean;
}

export default function PaperTrading() {
  const { toast } = useToast();
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [newBalance, setNewBalance] = useState<number>(100000); // State for new balance

  const { data: account, isLoading: isLoadingAccount } = useQuery({
    queryKey: ["/api/paper-trading/account"],
  });

  const { data: positions = [], isLoading: isLoadingPositions } = useQuery({
    queryKey: ["/api/paper-trading/positions"],
  });

  const form = useForm<TradeForm>({
    defaultValues: {
      symbol: "",
      side: 'buy',
      quantity: 0,
      orderType: 'MARKET',
      timeInForce: 'DAY',
      extendedHours: false,
    },
  });

  const tradeMutation = useMutation({
    mutationFn: async (data: TradeForm) => {
      const response = await fetch("/api/paper-trading/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(await response.text());
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

  const resetAccountMutation = useMutation({ // Mutation for resetting the account
    mutationFn: async () => {
      const response = await fetch('/api/paper-trading/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: newBalance })
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Account Reset', description: 'Your account balance has been reset.' });
    },
    onError: (error) => {
      toast({ title: 'Account Reset Failed', description: error.message, variant: 'destructive' });
    }
  })

  const handleResetAccount = () => {
    resetAccountMutation.mutate();
  };


  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Paper Trading</h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          {/* Main Trading Area - 8 columns */}
          <div className="md:col-span-8 space-y-6">
            {/* Account Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Net Account Value</div>
                    <div className="text-2xl font-bold">${account?.balance.toLocaleString()}</div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="mt-2">
                          Reset Account
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reset Paper Trading Account</DialogTitle>
                          <DialogDescription>
                            Enter the amount you want to set as your new account balance.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="balance">New Balance</Label>
                            <Input
                              id="balance"
                              type="number"
                              min="1000"
                              step="1000"
                              defaultValue="100000"
                              onChange={(e) => setNewBalance(Number(e.target.value))}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleResetAccount} disabled={resetAccountMutation.isPending}>
                            {resetAccountMutation.isPending ? "Resetting..." : "Reset Account"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Overall P&L</div>
                    <div className={`text-xl font-bold ${account?.totalPnl >= 0 ? 'text-[#00C805]' : 'text-[#FF333A]'}`}>
                      {account?.totalPnl >= 0 ? '+' : ''}{((account?.totalPnl || 0) / account?.balance * 100).toFixed(2)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Buying Power</div>
                    <div className="text-2xl font-bold">${account?.balance.toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chart */}
            <StockChart />

            {/* Order Entry */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Place Order</CardTitle>
                <Toggle
                  pressed={orderType === 'options'}
                  onPressedChange={(pressed) => setOrderType(pressed ? 'options' : 'stocks')}
                >
                  {orderType === 'options' ? 'Options Trading' : 'Stock Trading'}
                </Toggle>
              </CardHeader>
              <CardContent>
                {orderType === 'stocks' ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => tradeMutation.mutate(data))} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
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
                          name="side"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Side</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select side" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="buy">Buy</SelectItem>
                                  <SelectItem value="sell">Sell</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="orderType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Order Type</FormLabel>
                              <Select onValueChange={(value) => {
                                field.onChange(value);
                                setOrderType(value as 'MARKET' | 'LIMIT');
                              }} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select order type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="MARKET">Market</SelectItem>
                                  <SelectItem value="LIMIT">Limit</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        {orderType === 'LIMIT' && (
                          <FormField
                            control={form.control}
                            name="limitPrice"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Limit Price</FormLabel>
                                <FormControl>
                                  <Input type="number" step="0.01" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                        <FormField
                          control={form.control}
                          name="timeInForce"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time in Force</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select TIF" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="DAY">Day</SelectItem>
                                  <SelectItem value="GTC">GTC</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="extendedHours"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Extended Hours</FormLabel>
                              <FormControl>
                                <Toggle
                                  pressed={field.value}
                                  onPressedChange={field.onChange}
                                  className="w-full"
                                >
                                  {field.value ? 'Yes' : 'No'}
                                </Toggle>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        {tradeMutation.isPending ? "Placing Order..." : "Place Order"}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <OptionsChainSimulator />
                )}
              </CardContent>
            </Card>

            {/* Positions */}
            <Card>
              <CardHeader>
                <CardTitle>Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {positions.map((position) => (
                    <div
                      key={position.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div>
                        <div className="font-medium">{position.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {position.quantity} shares @ ${position.entryPrice}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${position.pnl >= 0 ? 'text-[#00C805]' : 'text-[#FF333A]'}`}>
                          {position.pnl >= 0 ? <TrendingUp className="inline h-4 w-4 mr-1" /> : <TrendingDown className="inline h-4 w-4 mr-1" />}
                          ${Math.abs(position.pnl).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {positions.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      No open positions
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 4 columns */}
          <div className="md:col-span-4 space-y-6">
            <Watchlist />
            <TradeHistory />
            <PaperTradingLeaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}