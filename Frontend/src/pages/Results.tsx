import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import ResultBar from "@/components/ResultBar";
import { useVoting } from "@/contexts/VotingContext";
import { Trophy, Home, RotateCcw } from "lucide-react";

const Results = () => {
  const navigate = useNavigate();
  const { currentPool, currentUser, resetAll } = useVoting();

  useEffect(() => {
    if (!currentPool || !currentUser) {
      navigate("/");
    }
  }, [currentPool, currentUser, navigate]);

  // Calculate results with ranked choice scoring
  const results = useMemo(() => {
    if (!currentPool) return [];

    const scores = new Map<string, number>();
    
    // Initialize scores
    currentPool.nominations.forEach(nom => {
      scores.set(nom.id, 0);
    });

    // Calculate weighted scores (higher rank = more points)
    currentPool.votes.forEach(vote => {
      vote.rankings.forEach(({ nominationId, rank }) => {
        // Invert ranking: 1st place gets most points
        const points = currentPool.votesPerParticipant - rank + 1;
        scores.set(nominationId, (scores.get(nominationId) || 0) + points);
      });
    });

    // Sort by score descending
    const sorted = Array.from(scores.entries())
      .map(([nominationId, totalPoints]) => {
        const nomination = currentPool.nominations.find(n => n.id === nominationId);
        return {
          nominationId,
          nominationText: nomination?.text || "Unknown",
          totalPoints,
        };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints);

    return sorted;
  }, [currentPool]);

  const totalPoints = results.reduce((sum, r) => sum + r.totalPoints, 0);

  if (!currentPool || !currentUser) {
    return null;
  }

  const handleNewPool = () => {
    resetAll();
    navigate("/create");
  };

  const handleHome = () => {
    resetAll();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-center">
        <Logo size="sm" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 pb-8">
        <div className="max-w-lg w-full mx-auto flex-1 flex flex-col">
          {/* Winner Celebration */}
          {results.length > 0 && (
            <div className="text-center mb-8 animate-scale-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-vote-success/20 mb-4">
                <Trophy className="w-8 h-8 text-vote-success" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {results[0].nominationText}
              </h1>
              <p className="text-muted-foreground">Winner of "{currentPool.topic}"</p>
            </div>
          )}

          {/* Results List */}
          <div className="flex-1 space-y-3 mb-6">
            {results.map((result, index) => (
              <ResultBar
                key={result.nominationId}
                nomination={result.nominationText}
                votes={result.totalPoints}
                totalVotes={totalPoints}
                rank={index + 1}
                isWinner={index === 0}
                index={index}
              />
            ))}
          </div>

          {/* Info */}
          <p className="text-center text-sm text-muted-foreground mb-6">
            Results calculated using Ranked Choice Voting
          </p>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleHome}
              className="flex-1"
            >
              <Home className="w-5 h-5" />
              Home
            </Button>
            <Button
              variant="hero"
              size="lg"
              onClick={handleNewPool}
              className="flex-1"
            >
              <RotateCcw className="w-5 h-5" />
              New Pool
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
