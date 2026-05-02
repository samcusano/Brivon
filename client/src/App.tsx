import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DesignLab from "./pages/__design_lab/index";
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
import AppealIntake from "./pages/AppealIntake";
import AdvocatePortal from "./pages/AdvocatePortal";
import PatientCase from "./pages/PatientCase";

function Router() {
  return (
    <Switch>
      <Route path="/__design_lab" component={DesignLab} />
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
      <Route path="/appeal-intake" component={AppealIntake} />
      <Route path="/advocate" component={AdvocatePortal} />
      <Route path="/case/:id">
        {(params) => <PatientCase caseId={params.id!} />}
      </Route>
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
