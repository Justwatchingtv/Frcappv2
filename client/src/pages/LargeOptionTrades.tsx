import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
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
  size?: number;
  timestamp: string;
}

export default function LargeOptionTrades() {
  const isMobile = useIsMobile();
  const [currentTab, setCurrentTab] = useState("flow");
  const { data: flow, isLoading } = useQuery<OptionsFlow[]>({
    queryKey: ["/api/options-flow"],
    refetchInterval: 5000,
  });

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Options Data</h1>
          </div>
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                  <Link href="/markets">
                    <Button variant="ghost" className="w-full justify-start">Markets</Button>
                  </Link>
                  <Link href="/paper-trading">
                    <Button variant="ghost" className="w-full justify-start">Paper Trading</Button>
                  </Link>
                  <Link href="/large-option-trades">
                    <Button variant="ghost" className="w-full justify-start">Large Option Trades</Button>
                  </Link>
                  <Link href="/challenges">
                    <Button variant="ghost" className="w-full justify-start">Challenges</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {isMobile ? (
          <div className="space-y-4">
            <Select onValueChange={(value) => setCurrentTab(value)} defaultValue="flow">
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flow">Flow Feed</SelectItem>
              <SelectItem value="scalps">Scalps</SelectItem>
              <SelectItem value="unusual">Unusual</SelectItem>
              <SelectItem value="golden">Golden Sweeps</SelectItem>
              <SelectItem value="explorer">Contract Explorer</SelectItem>
              <SelectItem value="frc">FRC AI Sweeps</SelectItem>
            </SelectContent>
          </Select>
          <Card>
            <CardContent className="overflow-x-auto">
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
                      <TableHead>Volume</TableHead>
                      <TableHead>Premium</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flow?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.timestamp ? format(new Date(parseInt(item.timestamp)), "HH:mm:ss") : "-"}
                        </TableCell>
                        <TableCell>{item.ticker}</TableCell>
                        <TableCell>
                          <Badge variant={item.type === "call" ? "default" : "destructive"}>
                            {item.type.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>${item.strike}</TableCell>
                        <TableCell>
                          {format(new Date(item.expiry), "MM/dd/yyyy")}
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          </div>
        ) : (
          <Tabs defaultValue="flow" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="flow">Flow Feed</TabsTrigger>
              <TabsTrigger value="scalps">Scalps</TabsTrigger>
              <TabsTrigger value="unusual">Unusual</TabsTrigger>
              <TabsTrigger value="golden">Golden Sweeps</TabsTrigger>
              <TabsTrigger value="explorer">Contract Explorer</TabsTrigger>
              <TabsTrigger value="frc">FRC AI Sweeps</TabsTrigger>
            </TabsList>

            <TabsContent value="flow">
              <Card>
                <CardHeader>
                  <CardTitle>Flow Feed</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
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
                          <TableHead>Volume</TableHead>
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
                            <TableCell>
                              {format(new Date(item.expiry), "MM/dd/yyyy")}
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
                <CardContent className="overflow-x-auto">
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
                          <TableHead>Volume</TableHead>
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
                            <TableCell>
                              {format(new Date(item.expiry), "MM/dd/yyyy")}
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
                <CardContent className="overflow-x-auto">
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
                          <TableHead>Volume</TableHead>
                          <TableHead>Premium</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {flow?.filter(item => {
                          const isPremiumUnusual = item.premium > 100000;
                          const isVolumeUnusual = item.volume > 1000;
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
                            <TableCell>
                              {format(new Date(item.expiry), "MM/dd/yyyy")}
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="golden">
              <Card>
                <CardHeader>
                  <CardTitle>Golden Sweeps</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
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
                          <TableHead>Volume</TableHead>
                          <TableHead>Premium</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {flow?.filter(item => item.premium >= 250000).map((item) => (
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
                            <TableCell>
                              {format(new Date(item.expiry), "MM/dd/yyyy")}
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="million">
              <Card>
                <CardHeader>
                  <CardTitle>Premium $1M+</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
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
                          <TableHead>Volume</TableHead>
                          <TableHead>Premium</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {flow?.filter(item => item.premium >= 1000000).map((item) => (
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
                            <TableCell>
                              {format(new Date(item.expiry), "MM/dd/yyyy")}
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="frc">
              <Card>
                <CardHeader>
                  <CardTitle>FRC AI Sweeps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8 text-muted-foreground">
                    Coming soon...
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}