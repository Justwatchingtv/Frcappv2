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

export function OptionsFlow() {
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
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticker</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Strike</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Premium</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flow?.map((item: any) => (
              <TableRow key={item.id}>
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
