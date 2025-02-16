import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function OptionsFlow() {
  const { toast } = useToast();
  const { data: flow, isLoading } = useQuery({
    queryKey: ["/api/options-flow"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Options Flow</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Options Flow</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Strike</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flow?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.timestamp ? format(new Date(parseInt(item.timestamp)), 'HH:mm:ss') : '-'}
                </TableCell>
                <TableCell
                  className="font-medium cursor-pointer hover:text-primary hover:underline"
                  onClick={() => window.location.href = `/ticker/${item.ticker}`}
                >
                  {item.ticker}
                </TableCell>
                <TableCell>
                  <Badge variant={item.type === 'call' ? 'default' : 'destructive'}>
                    {item.type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>${item.strike}</TableCell>
                <TableCell>
                  {format(new Date(item.expiry), 'MM/dd/yyyy')}
                  <span className="text-muted-foreground text-xs ml-2">
                    ({Math.ceil((new Date(item.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d)
                  </span>
                </TableCell>
                <TableCell>{item.size?.toLocaleString() || '-'}</TableCell>
                <TableCell>{item.volume.toLocaleString()}</TableCell>
                <TableCell>
                  ${(item.premium / 100).toLocaleString()}
                  <span className="text-xs text-muted-foreground ml-1">
                    (${((item.premium * item.volume) / 100).toLocaleString()} total)
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      fetch('/api/paper-trading/trade', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          symbol: item.ticker,
                          type: item.type,
                          strike: item.strike,
                          expiry: item.expiry,
                          amount: item.premium
                        })
                      })
                      .then(response => {
                        if (!response.ok) throw new Error('Trade failed');
                        return response.json();
                      })
                      .then(() => {
                        toast({
                          title: "Trade Executed",
                          description: `Opened ${item.type.toUpperCase()} position in ${item.ticker}`,
                        });
                      })
                      .catch(error => {
                        toast({
                          title: "Trade Failed",
                          description: error.message,
                          variant: "destructive",
                        });
                      });
                    }}
                  >
                    Trade
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}