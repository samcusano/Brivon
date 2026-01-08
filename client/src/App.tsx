import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Vault from "@/pages/Vault";
import History from "@/pages/History";

import Dashboard from "./pages/Dashboard";
import FindingDetail from "./pages/FindingDetail";
import EntityProfile from "./pages/EntityProfile";
import { Redirect } from "wouter";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/finding/:id" component={FindingDetail} />
      <Route path="/agents">{() => <Redirect to="/dashboard" />}</Route>
      <Route path="/entity/:id" component={EntityProfile} />
      <Route path="/vault" component={Vault} />
      <Route path="/history" component={History} />
      <Route component={NotFound} />
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
