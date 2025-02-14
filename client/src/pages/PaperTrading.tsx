import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "wouter";

interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
}

interface Position {
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPct: number;
}

export default function PaperTrading() {
  const [orderType, setOrderType] = useState<"market" | "limit">("limit");
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState("");
  const [side, setSide] = useState<"buy" | "sell">("buy");

  const { data: account } = useQuery({
    queryKey: ["/api/paper-trading/account"],
    queryFn: async () => {
      const res = await fetch("/api/paper-trading/account");
      if (!res.ok) throw new Error("Failed to fetch account");
      return res.json();
    },
  });

  const { data: positions } = useQuery({
    queryKey: ["/api/paper-trading/positions"],
    queryFn: async () => {
      const res = await fetch("/api/paper-trading/positions");
      if (!res.ok) throw new Error("Failed to fetch positions");
      return res.json();
    },
  });

  const handleSubmitOrder = async () => {
    try {
      const response = await fetch("/api/paper-trading/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symbol,
          quantity: parseInt(quantity),
          price: orderType === "limit" ? parseFloat(limitPrice) : undefined,
          type: orderType,
          side,
        }),
      });

      if (!response.ok) {
        throw new Error("Trade failed");
      }

      // Reset form
      setSymbol("");
      setQuantity("");
      setLimitPrice("");
    } catch (error) {
      console.error("Trade error:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Paper Trading</h1>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Account Summary */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Net Account Value</Label>
                <div className="text-2xl font-bold">
                  ${account?.balance.toLocaleString()}
                </div>
              </div>
              <div>
                <Label>Day's P&L</Label>
                <div className={`text-lg font-semibold ${account?.dailyPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {account?.dailyPnl >= 0 ? '+' : ''}{account?.dailyPnl.toLocaleString()}
                </div>
              </div>
              <div>
                <Label>Total P&L</Label>
                <div className={`text-lg font-semibold ${account?.totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {account?.totalPnl >= 0 ? '+' : ''}{account?.totalPnl.toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Form */}
        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Place Order</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Symbol</Label>
                <Input
                  placeholder="Enter symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Side</Label>
                  <Select value={side} onValueChange={(value: "buy" | "sell") => setSide(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Order Type</Label>
                  <Select
                    value={orderType}
                    onValueChange={(value: "market" | "limit") => setOrderType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="limit">Limit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              {orderType === "limit" && (
                <div>
                  <Label>Limit Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Enter limit price"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                  />
                </div>
              )}

              <Button
                className="w-full"
                variant={side === "buy" ? "default" : "destructive"}
                onClick={handleSubmitOrder}
              >
                Place {side.toUpperCase()} Order
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Positions */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>P&L</TableHead>
                  <TableHead>%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions?.map((position: Position) => (
                  <TableRow key={position.symbol}>
                    <TableCell>{position.symbol}</TableCell>
                    <TableCell>{position.quantity}</TableCell>
                    <TableCell className={position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                      ${position.pnl.toFixed(2)}
                    </TableCell>
                    <TableCell className={position.pnlPct >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {position.pnlPct >= 0 ? '+' : ''}{position.pnlPct.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}