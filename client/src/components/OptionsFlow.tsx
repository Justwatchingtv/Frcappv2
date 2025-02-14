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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function OptionsFlow() {
  const { data: flow, isLoading } = useQuery({
    queryKey: ["/api/options-flow"],
    refetchInterval: 5000,
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
        <Tabs defaultValue="flow" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="flow">Flow Feed</TabsTrigger>
            <TabsTrigger value="scalps">Scalps</TabsTrigger>
            <TabsTrigger value="unusual">Unusual</TabsTrigger>
            <TabsTrigger value="golden">Golden Sweeps</TabsTrigger>
          </TabsList>
        </Tabs>
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
            {flow?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.time || 'N/A'}</TableCell>
                <TableCell>{item.ticker}</TableCell>
                <TableCell>
                  <Badge variant={item.type === 'CALL' ? 'default' : 'destructive'}>
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell>${item.strike}</TableCell>
                <TableCell>{format(new Date(item.expiry), 'MM/dd/yyyy')}</TableCell>
                <TableCell>{item.volume.toLocaleString()}</TableCell>
                <TableCell>${item.premium.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}