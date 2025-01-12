import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Activity, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

// Mock data - will be replaced with real data later
const mockMarketData = {
  trending: [
    { symbol: "AAPL", change: "+2.3%" },
    { symbol: "TSLA", change: "-1.2%" },
    { symbol: "NVDA", change: "+3.1%" },
  ],
  volatility: "High",
};

export function MarketData() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="hover:bg-accent/50 transition-colors">
          <Link href="/large-options">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Options Data</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Market Insights</div>
              <p className="text-xs text-muted-foreground mt-1">
                Analyze premium options data
              </p>
            </CardContent>
          </Link>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="hover:bg-accent/50 transition-colors">
          <Link href="/paper-trading">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paper Trading</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Simulator</div>
              <p className="text-xs text-muted-foreground mt-1">
                Practice trading strategies
              </p>
            </CardContent>
          </Link>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="hover:bg-accent/50 transition-colors">
          <Link href="/challenges">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Challenges</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Compete</div>
              <p className="text-xs text-muted-foreground mt-1">
                Join trading competitions
              </p>
            </CardContent>
          </Link>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Volatility</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-2xl font-bold"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              {mockMarketData.volatility}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}