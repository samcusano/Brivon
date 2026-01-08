import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Marketplace from "./pages/Marketplace";
import AdvocateDetail from "./pages/AdvocateDetail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Marketplace} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/advocate/:id" component={AdvocateDetail} />
      <Route component={Marketplace} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
