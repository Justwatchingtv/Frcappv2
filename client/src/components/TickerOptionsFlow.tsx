
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

interface OptionsFlow {
  id: number;
  ticker: string;
  strike: number;
  expiry: string;
  premium: number;
  type: string;
  volume: number;
  timestamp: string;
}

export function TickerOptionsFlow({ symbol }: { symbol: string }) {
  const { data: flow, isLoading } = useQuery<OptionsFlow[]>({
    queryKey: [`/api/options-flow/${symbol}`],
    refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Strike</TableHead>
            <TableHead>Expiry</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Premium</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flow?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {format(new Date(parseInt(item.timestamp)), 'HH:mm:ss')}
              </TableCell>
              <TableCell>
                <Badge variant={item.type === 'call' ? 'default' : 'destructive'}>
                  {item.type.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>${item.strike}</TableCell>
              <TableCell>{format(new Date(item.expiry), 'MM/dd/yyyy')}</TableCell>
              <TableCell>{item.volume.toLocaleString()}</TableCell>
              <TableCell>${(item.premium / 100).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
