import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trophy, Users, Clock } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Challenges() {
  const { data: challenges, isLoading } = useQuery({
    queryKey: ["/api/challenges"],
  });

  const statusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-blue-500';
      case 'active':
        return 'text-green-500';
      case 'completed':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Trading Challenges</h1>
            <p className="text-muted-foreground mt-2">
              Compete with other traders in time-limited trading competitions
            </p>
          </div>
          <Link href="/challenges/create">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Challenge
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {challenges?.map((challenge: any) => (
            <Card key={challenge.id} className="hover:bg-accent/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{challenge.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {challenge.description}
                    </CardDescription>
                  </div>
                  <span className={`font-medium ${statusColor(challenge.status)}`}>
                    {challenge.status.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {challenge.participants?.length || 0} / {challenge.maxParticipants || '∞'} Participants
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      ${challenge.initialBalance.toLocaleString()} Initial Balance
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      Ends {format(new Date(challenge.endDate), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href={`/challenges/${challenge.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
