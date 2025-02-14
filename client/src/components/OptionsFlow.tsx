
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
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
import { OptionsFlowFilters, Filters } from "./OptionsFlowFilters";

export function OptionsFlow() {
  const [filters, setFilters] = useState<Filters>({
    unusual: false,
    scalp: false,
    golden: false,
  });

  const { data: flow, isLoading } = useQuery({
    queryKey: ["/api/options-flow"],
    refetchInterval: 5000,
    staleTime: 1000,
  });

  const filteredFlow = flow?.filter((item: any) => {
    if (!filters.unusual && !filters.scalp && !filters.golden) {
      return true;
    }

    const volume = item.volume;
    const premium = item.premium / 100; // Convert to dollars

    return (
      (filters.unusual && volume > 1000) ||
      (filters.scalp && premium <= 0.05) ||
      (filters.golden && volume > 1000 && premium > 0.10)
    );
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
    <Card className="bg-gray-900">
      <CardHeader>
        <CardTitle>Options Flow</CardTitle>
        <OptionsFlowFilters filters={filters} onFilterChange={setFilters} />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Ticker</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Strike</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Premium</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFlow?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{format(new Date(item.timestamp), 'HH:mm:ss')}</TableCell>
                <TableCell className="font-medium">{item.ticker}</TableCell>
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
      </CardContent>
    </Card>
  );
}
