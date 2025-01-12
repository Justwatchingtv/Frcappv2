import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, TrendingUp, Clock, DollarSign, Users, Award, Camera, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

type Achievement = {
  id: number;
  name: string;
  description: string;
  unlockedAt: string;
};

type ProfileFormData = {
  fullName: string;
  bio: string;
  email: string;
  tradingStyle: string;
  riskTolerance: string;
  experienceLevel: string;
  preferredMarkets: string[];
  tradingGoals: string;
  dailyProfitTarget: number;
  maxDrawdown: number;
};

export function UserProfile() {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const form = useForm<ProfileFormData>({
    defaultValues: {
      fullName: user?.fullName || "",
      bio: user?.bio || "",
      email: user?.email || "",
      tradingStyle: user?.tradingStyle || "",
      riskTolerance: user?.riskTolerance || "",
      experienceLevel: user?.experienceLevel || "",
      preferredMarkets: user?.preferredMarkets || [],
      tradingGoals: user?.tradingGoals || "",
      dailyProfitTarget: Number(user?.dailyProfitTarget) || 0,
      maxDrawdown: Number(user?.maxDrawdown) || 0,
    },
  });

  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ["/api/user/achievements"],
  });

  const updateProfile = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const updateAvatar = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateAvatar.mutate(file);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <div className="mb-8 text-center">
        <div className="relative inline-block">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={user?.avatar || undefined} />
            <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-4 right-0">
            <Label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90">
                <Camera className="h-4 w-4" />
              </div>
            </Label>
            <Input 
              id="avatar-upload" 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold">{user?.username}</h1>
        <p className="text-muted-foreground">{user?.bio}</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Trading Style</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Style</Label>
                    <p className="font-medium">{user?.tradingStyle || "Not set"}</p>
                  </div>
                  <div>
                    <Label>Risk Tolerance</Label>
                    <p className="font-medium">{user?.riskTolerance || "Not set"}</p>
                  </div>
                  <div>
                    <Label>Experience Level</Label>
                    <p className="font-medium">{user?.experienceLevel || "Not set"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total P&L</span>
                    <span className={`font-medium ${Number(user?.totalPnl) >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {Number(user?.totalPnl).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Win Rate</span>
                    <span className="font-medium">{Number(user?.winRate).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Trades</span>
                    <span className="font-medium">{user?.tradesCount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Statistics</CardTitle>
              <CardDescription>Your trading performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div>
                  <Label>Average Position Size</Label>
                  <p className="text-2xl font-bold">
                    {Number(user?.averagePositionSize).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                </div>
                <div>
                  <Label>Average Holding Time</Label>
                  <p className="text-2xl font-bold">
                    {Number(user?.averageHoldingTime).toFixed(1)} hours
                  </p>
                </div>
                <div>
                  <Label>Best Trade</Label>
                  <p className="text-2xl font-bold text-green-500">
                    {Number(user?.bestTrade).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                </div>
                <div>
                  <Label>Worst Trade</Label>
                  <p className="text-2xl font-bold text-red-500">
                    {Number(user?.worstTrade).toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Achievements & Badges</CardTitle>
              <CardDescription>Your earned recognition and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
                {achievements?.map((achievement: Achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 border rounded-lg text-center space-y-2"
                  >
                    <Award className="h-8 w-8 mx-auto text-primary" />
                    <h3 className="font-medium">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Unlocked: {format(new Date(achievement.unlockedAt), "PP")}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your trading preferences and profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit((data) => updateProfile.mutate(data))}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input {...form.register("fullName")} />
                  </div>
                  <div>
                    <Label>Bio</Label>
                    <Textarea {...form.register("bio")} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" {...form.register("email")} />
                  </div>
                  <div>
                    <Label>Trading Style</Label>
                    <Select
                      onValueChange={(value) => form.setValue("tradingStyle", value)}
                      defaultValue={form.getValues("tradingStyle")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your trading style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day_trader">Day Trader</SelectItem>
                        <SelectItem value="swing_trader">Swing Trader</SelectItem>
                        <SelectItem value="position_trader">Position Trader</SelectItem>
                        <SelectItem value="scalper">Scalper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Risk Tolerance</Label>
                    <Select
                      onValueChange={(value) => form.setValue("riskTolerance", value)}
                      defaultValue={form.getValues("riskTolerance")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your risk tolerance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Trading Goals</Label>
                    <Textarea {...form.register("tradingGoals")} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Daily Profit Target ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...form.register("dailyProfitTarget", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                    <div>
                      <Label>Max Drawdown (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...form.register("maxDrawdown", {
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={updateProfile.isPending}
                >
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}