import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { OptionsFlow } from "@/components/OptionsFlow";
import { TrendingStocks } from "@/components/TrendingStocks";
import { SocialFeed } from "@/components/SocialFeed";
import { MarketData } from "@/components/MarketData";
import { Leaderboard } from "@/components/Leaderboard";
import { Link, useLocation } from "wouter";
import { BarChart2, LineChart, Newspaper, LogOut, Search, User } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useState, useEffect } from "react";

export default function Home() {
  const { user, logout } = useUser();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [, setLocation] = useLocation();

  // Mock data - Replace with real data from API
  const trendingStocks = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "TSLA", name: "Tesla, Inc." },
    { symbol: "NVDA", name: "NVIDIA Corporation" },
  ];

  const suggestedUsers = [
    { username: "trader_pro", followers: 1200 },
    { username: "market_guru", followers: 850 },
    { username: "options_master", followers: 950 },
  ];

  const todayNews = [
    { title: "Market Rally Continues", url: "#" },
    { title: "Fed Announces Rate Decision", url: "#" },
    { title: "Tech Stocks Lead Gains", url: "#" },
  ];

  useEffect(() => {
    if (searchQuery) {
      const filtered = trendingStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStocks(filtered);

      const filteredSuggestedUsers = suggestedUsers.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filteredSuggestedUsers);
    } else {
      setFilteredStocks(trendingStocks);
      setFilteredUsers(suggestedUsers);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-primary">Options Flow</h1>
          <nav className="flex flex-wrap items-center gap-2 md:gap-4 justify-center">
            <Button 
              variant="outline" 
              className="relative w-[200px] justify-start text-sm text-muted-foreground"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              Search ticker or trader...
            </Button>
            <Link href="/large-options">
              <Button variant="outline">
                <LineChart className="h-4 w-4 mr-2" />
                Options Data
              </Button>
            </Link>
            <Link href="/paper-trading">
              <Button variant="outline">
                <BarChart2 className="h-4 w-4 mr-2" />
                Paper Trading
              </Button>
            </Link>
            <Link href="/markets">
              <Button variant="outline">
                <Newspaper className="h-4 w-4 mr-2" />
                Markets
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
            <Button variant="outline" onClick={() => logout()}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput 
          placeholder="Type a ticker symbol or trader name..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          {searchQuery && filteredStocks.length === 0 && filteredUsers.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : null}
          <CommandGroup heading="Trending Stocks">
            {filteredStocks.map((stock) => (
              <CommandItem
                key={stock.symbol}
                onSelect={() => {
                  setSearchOpen(false);
                  window.location.href = `/ticker/${stock.symbol}`;
                }}
              >
                <span className="font-medium text-primary">${stock.symbol}</span>
                <span className="ml-2 text-muted-foreground">{stock.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Popular Traders">
            {filteredUsers.map((user) => (
              <CommandItem
                key={user.username}
                onSelect={() => {
                  setSearchOpen(false);
                  setLocation(`/profile/${user.username}`);
                }}
              >
                <span className="font-medium">@{user.username}</span>
                <span className="ml-2 text-muted-foreground">
                  {user.followers.toLocaleString()} followers
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Today's News">
            {todayNews.map((news, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  setSearchOpen(false);
                  window.open(news.url, '_blank');
                }}
              >
                <span>{news.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-4 md:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
            <div className="lg:col-span-8 space-y-4 md:space-y-8">
              <div className="overflow-x-auto">
                <TrendingStocks />
              </div>
              <div className="overflow-x-auto">
                <OptionsFlow />
              </div>
            </div>
            <div className="lg:col-span-4 space-y-4 md:space-y-8">
              <Leaderboard />
              <SocialFeed />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}