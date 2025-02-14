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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'wouter'; // Added import for Link component


export function OptionsFlow() {
  const [selectedTab, setSelectedTab] = useState("flow");

  const { data: flow, isLoading } = useQuery({
    queryKey: ["/api/options-flow"],
    refetchInterval: 5000,
  });

  const filterFlowByTab = (flow: any[], tab: string) => {
    if (!flow) return [];

    switch (tab) {
      case 'scalps':
        return flow.filter(item => item.premium <= 5); // $5 or less
      case 'unusual':
        return flow.filter(item => item.volume >= 1000);
      case 'golden':
        return flow.filter(item => item.volume >= 1000 && item.premium >= 10);
      case 'premium':
        return flow.filter(item => item.premium * item.volume >= 100000); // $100k+
      default:
        return flow;
    }
  };

  const filteredFlow = filterFlowByTab(flow, selectedTab);

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
        <Tabs defaultValue="flow" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="flow">Flow Feed</TabsTrigger>
            <TabsTrigger value="scalps">Scalps</TabsTrigger>
            <TabsTrigger value="unusual">Unusual</TabsTrigger>
            <TabsTrigger value="golden">Golden Sweeps</TabsTrigger>
            <TabsTrigger value="frc">FRC AI Sweeps</TabsTrigger>
            <TabsTrigger value="premium">Premium ($100K+)</TabsTrigger>
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
            {filteredFlow?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.timestamp ? format(new Date(parseInt(item.timestamp)), 'HH:mm:ss') : 'N/A'}
                </TableCell>
                <TableCell>
                  <Link href={`/ticker/${item.ticker}`} className="text-primary hover:underline"> {/* Corrected to use item.ticker and TableCell */}
                    {item.ticker}
                  </Link>
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
      </CardContent>
    </Card>
  );
}