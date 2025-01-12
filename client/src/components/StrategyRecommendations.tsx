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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2, Target, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function StrategyRecommendations() {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["/api/strategy-recommendations"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Strategy Recommendations</CardTitle>
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
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Strategy Recommendations
        </CardTitle>
        <CardDescription>
          Personalized trading strategies based on your preferences and market conditions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {recommendations?.map((strategy: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Accordion type="single" collapsible>
                  <AccordionItem value={`strategy-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold">{strategy.name}</span>
                        <Badge
                          variant={
                            strategy.riskLevel === "low"
                              ? "secondary"
                              : strategy.riskLevel === "medium"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {strategy.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <p className="text-sm text-muted-foreground">
                          {strategy.description}
                        </p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="h-4 w-4" />
                            <span className="font-medium">Time Horizon:</span>
                            <span>{strategy.timeHorizon}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">Key Indicators:</span>
                            <span>{strategy.indicators.join(", ")}</span>
                          </div>
                        </div>

                        {strategy.suggestedSetup && (
                          <div className="mt-4 rounded-lg bg-muted p-4">
                            <h4 className="mb-2 font-medium">Suggested Setup</h4>
                            <div className="space-y-1 text-sm">
                              {Object.entries(strategy.suggestedSetup).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    {key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}:
                                  </span>
                                  <span className="font-medium">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
