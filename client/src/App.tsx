import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Marketplace from "./pages/Marketplace";
import AdvocateDetail from "./pages/AdvocateDetail";
import MatchIntake from "./pages/MatchIntake";
import CaseDashboard from "./pages/CaseDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AppealCasePage from "./pages/AppealCasePage";
import AdvocateDashboard from "./pages/AdvocateDashboard";
import SecondOpinion from "./pages/SecondOpinion";
import ClinicalTrials from "./pages/ClinicalTrials";
import AdvocateOnboarding from "./pages/AdvocateOnboarding";
import AdvocateOnboardingStart from "./pages/AdvocateOnboardingStart";
import OnboardingStatus from "./pages/OnboardingStatus";
import AdminReview from "./pages/AdminReview";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import PatientCases from "./pages/PatientCases";
import PatientCaseDashboard from "./pages/PatientCaseDashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Marketplace} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/advocate/:id" component={AdvocateDetail} />
      <Route path="/match" component={MatchIntake} />
      <Route path="/cases" component={CaseDashboard} />
      <Route path="/employer" component={EmployerDashboard} />
      <Route path="/employer/appeals/:id" component={AppealCasePage} />
      <Route path="/advocate-portal" component={AdvocateDashboard} />
      <Route path="/second-opinion" component={SecondOpinion} />
      <Route path="/trials" component={ClinicalTrials} />
      <Route path="/onboard/start" component={AdvocateOnboardingStart} />
      <Route path="/onboard" component={AdvocateOnboarding} />
      <Route path="/onboard/status" component={OnboardingStatus} />
      <Route path="/admin/review" component={AdminReview} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/my-cases" component={PatientCases} />
      <Route path="/my-cases/:id" component={PatientCaseDashboard} />
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
