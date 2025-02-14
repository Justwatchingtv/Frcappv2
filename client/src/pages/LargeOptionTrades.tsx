import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface OptionsFlow {
  id: string;
  ticker: string;
  strike: number;
  expiry: string;
  premium: number;
  type: string;
  volume: number;
  timestamp: string;
}

export default function LargeOptionTrades() {
  const { data: flow, isLoading } = useQuery<OptionsFlow[]>({
    queryKey: ["/api/options-flow"],
    refetchInterval: 5000,
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Options Data</h1>
        </div>

        <Tabs defaultValue="flow" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="flow">Flow Feed</TabsTrigger>
            <TabsTrigger value="scalps">Scalps</TabsTrigger>
            <TabsTrigger value="unusual">Unusual</TabsTrigger>
            <TabsTrigger value="golden">Golden Sweeps</TabsTrigger>
            <TabsTrigger value="frc">FRC AI Sweeps</TabsTrigger>
            <TabsTrigger value="premium">Premium ($100K+)</TabsTrigger>
          </TabsList>

          <TabsContent value="flow">
            <Card>
              <CardHeader>
                <CardTitle>Flow Feed</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Strike</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Premium</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flow?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.timestamp ? format(new Date(item.timestamp), "HH:mm:ss") : "-"}
                          </TableCell>
                          <TableCell>{item.ticker}</TableCell>
                          <TableCell>
                            <Badge variant={item.type === "call" ? "default" : "destructive"}>
                              {item.type.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>${item.strike}</TableCell>
                          <TableCell>{format(new Date(item.expiry), "MM/dd/yyyy")}</TableCell>
                          <TableCell>{item.volume.toLocaleString()}</TableCell>
                          <TableCell>${item.premium.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scalps">
            <Card>
              <CardHeader>
                <CardTitle>Scalps</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Strike</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Premium</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flow?.filter(item => {
                        const expiryDate = new Date(item.expiry);
                        const today = new Date();
                        const diffTime = Math.abs(expiryDate.getTime() - today.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        return diffDays <= 7;
                      }).map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {item.timestamp ? format(new Date(item.timestamp), "HH:mm:ss") : "-"}
                          </TableCell>
                          <TableCell>{item.ticker}</TableCell>
                          <TableCell>
                            <Badge variant={item.type === "call" ? "default" : "destructive"}>
                              {item.type.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>${item.strike}</TableCell>
                          <TableCell>{format(new Date(item.expiry), "MM/dd/yyyy")}</TableCell>
                          <TableCell>{item.volume.toLocaleString()}</TableCell>
                          <TableCell>${item.premium.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unusual">
              <Card>
                <CardHeader>
                  <CardTitle>Unusual Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Symbol</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Strike</TableHead>
                          <TableHead>Expiry</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Premium</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {flow?.filter(item => {
                          const isPremiumUnusual = item.premium > 100000; // Premium > $100k
                          const isVolumeUnusual = item.volume > 1000; // Volume > 1000 contracts
                          return isPremiumUnusual || isVolumeUnusual;
                        }).map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              {item.timestamp ? format(new Date(item.timestamp), "HH:mm:ss") : "-"}
                            </TableCell>
                            <TableCell>{item.ticker}</TableCell>
                            <TableCell>
                              <Badge variant={item.type === "call" ? "default" : "destructive"}>
                                {item.type.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>${item.strike}</TableCell>
                            <TableCell>{format(new Date(item.expiry), "MM/dd/yyyy")}</TableCell>
                            <TableCell>{item.volume.toLocaleString()}</TableCell>
                            <TableCell>${item.premium.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          {["golden", "frc", "premium"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{tab}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    Coming soon...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}