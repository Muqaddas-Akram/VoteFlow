import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VotingProvider } from "./contexts/VotingContext";
import Landing from "./pages/Landing";
import CreatePool from "./pages/CreatePool";
import JoinPool from "./pages/JoinPool";
import WaitingRoom from "./pages/WaitingRoom";
import Nominations from "./pages/Nominations";
import Voting from "./pages/Voting";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";


const App = () => (
      <VotingProvider>
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/create" element={<CreatePool />} />
            <Route path="/join" element={<JoinPool />} />
            <Route path="/waiting" element={<WaitingRoom />} />
            <Route path="/nominations" element={<Nominations />} />
            <Route path="/voting" element={<Voting />} />
            <Route path="/results" element={<Results />} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </VotingProvider>
);

export default App;
