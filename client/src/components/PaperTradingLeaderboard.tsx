import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  id: number;
  username: string;
  totalPnl: string;
  winRate: string;
  tradesCount: number;
}

export function PaperTradingLeaderboard() {
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/paper-trading/leaderboard"],
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <CardTitle>Top Traders</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboard?.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium 
                  ${index === 0 ? 'bg-yellow-500 text-black' : 
                    index === 1 ? 'bg-gray-300 text-black' : 
                    index === 2 ? 'bg-amber-700 text-white' : 
                    'bg-muted text-muted-foreground'}`}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{entry.username}</div>
                  <div className="text-sm text-muted-foreground">
                    {entry.tradesCount} trades • {entry.winRate}% win rate
                  </div>
                </div>
              </div>
              <div className={`text-right font-medium ${parseFloat(entry.totalPnl) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {parseFloat(entry.totalPnl) >= 0 ? 
                  <TrendingUp className="inline h-4 w-4 mr-1" /> : 
                  <TrendingDown className="inline h-4 w-4 mr-1" />}
                ${Math.abs(parseFloat(entry.totalPnl)).toLocaleString()}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Trophy className="h-8 w-8 animate-pulse text-muted-foreground" />
            </div>
          )}

          {leaderboard?.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No traders yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
