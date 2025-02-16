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
import { ScrollArea } from "@/components/ui/scroll-area";


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

interface OptionsFlowNew {
  id: number;
  ticker: string;
  strike: number;
  type: string;
  expiry: string;
  premium: number;
  size: number;
  time: string;
}

export function TickerOptionsFlow({ symbol }: { symbol: string }) {
  const [optionsFlow, setOptionsFlow] = useState<OptionsFlowNew[]>([]);

  useEffect(() => {
    const fetchOptionsFlow = async () => {
      try {
        const response = await fetch(`/api/options-flow/${symbol}`);
        const data = await response.json();
        setOptionsFlow(data);
      } catch (error) {
        console.error("Error fetching options flow:", error);
      }
    };

    fetchOptionsFlow();
    const interval = setInterval(fetchOptionsFlow, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-2">
        {optionsFlow.map((flow) => (
          <div
            key={flow.id}
            className={`p-4 rounded-lg border ${
              flow.type === "CALL" ? "border-green-500/20" : "border-red-500/20"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">${flow.strike}</span>
                <span
                  className={`ml-2 ${
                    flow.type === "CALL" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {flow.type}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(flow.time).toLocaleTimeString()}
              </div>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Exp: {format(new Date(flow.expiry), "MMM d, yyyy")}
            </div>
            <div className="mt-2 flex justify-between">
              <span>Size: {flow.size.toLocaleString()}</span>
              <span>Premium: ${flow.premium.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export function TickerOptionsTable({ symbol }: { symbol: string }) {
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