import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { useUser } from "./hooks/use-user";
import { Loader2 } from "lucide-react";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import LargeOptionTrades from "./pages/LargeOptionTrades";
import PaperTrading from "./pages/PaperTrading";
import Markets from "./pages/Markets";
import TickerView from "./pages/TickerView";
import { UserProfile } from "@/components/UserProfile";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthPage />
        <Toaster />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/large-options" component={LargeOptionTrades} />
        <Route path="/paper-trading" component={PaperTrading} />
        <Route path="/markets" component={Markets} />
        <Route path="/ticker/:symbol" component={TickerView} />
        <Route path="/profile" component={UserProfile} />
      </Switch>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;