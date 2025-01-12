import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, TrendingUp, Activity, User } from "lucide-react";
import { motion } from "framer-motion";

type LeaderboardUser = {
  id: number;
  username: string;
  totalPnl: number;
  weeklyPnl: number;
  winRate: number;
  tradesCount: number;
};

export function Leaderboard() {
  const { data: users, isLoading } = useQuery<LeaderboardUser[]>({
    queryKey: ["/api/leaderboard"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Traders</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Activity className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top Traders
        </CardTitle>
        <CardDescription>
          Leaderboard based on total P&L and performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {users?.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-lg border p-4 hover:bg-accent transition-colors"
              >
                <div className="absolute -left-1 -top-1">
                  {index === 0 && (
                    <Badge className="bg-yellow-500">
                      <Trophy className="h-3 w-3 mr-1" />
                      #1
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{user.username}</span>
                  </div>
                  <Badge
                    variant={user.totalPnl >= 0 ? "default" : "destructive"}
                    className="ml-2"
                  >
                    {user.totalPnl >= 0 ? "+" : ""}
                    {user.totalPnl.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Weekly:</span>
                    <span
                      className={
                        user.weeklyPnl >= 0 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {" "}
                      {user.weeklyPnl >= 0 ? "+" : ""}
                      {user.weeklyPnl.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Win Rate:</span>
                    <span> {(user.winRate * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trades:</span>
                    <span> {user.tradesCount}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
