import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import VotingCard from "@/components/VotingCard";
import { useVoting } from "@/contexts/VotingContext";
import { CheckCircle2, ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";

const Voting = () => {
  const navigate = useNavigate();
  const { currentPool, currentUser, submitVote, endVoting } = useVoting();
  const [rankings, setRankings] = useState<Map<string, number>>(new Map());
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!currentPool || !currentUser) {
      navigate("/");
      return;
    }
    if (currentPool.phase === 'results') {
      navigate("/results");
    }
    setHasVoted(currentUser.hasVoted);
  }, [currentPool, currentUser, navigate]);

  if (!currentPool || !currentUser) {
    return null;
  }

  const handleSelect = (nominationId: string) => {
    if (hasVoted) return;
    
    const newRankings = new Map(rankings);
    
    if (newRankings.has(nominationId)) {
      // Remove this ranking and shift others down
      const removedRank = newRankings.get(nominationId)!;
      newRankings.delete(nominationId);
      
      // Shift down ranks above the removed one
      newRankings.forEach((rank, id) => {
        if (rank > removedRank) {
          newRankings.set(id, rank - 1);
        }
      });
    } else {
      // Add new ranking if not at max
      if (newRankings.size < currentPool.votesPerParticipant) {
        newRankings.set(nominationId, newRankings.size + 1);
      }
    }
    
    setRankings(newRankings);
  };

  const handleSubmitVote = () => {
    if (rankings.size !== currentPool.votesPerParticipant) {
      toast.error(`Please select ${currentPool.votesPerParticipant} choices`);
      return;
    }

    const voteRankings = Array.from(rankings.entries()).map(([nominationId, rank]) => ({
      nominationId,
      rank,
    }));

    submitVote(voteRankings);
    setHasVoted(true);
    toast.success("Vote submitted!");
  };

  const handleEndVoting = () => {
    endVoting();
    navigate("/results");
  };

  const allVoted = currentPool.participants.every(p => p.hasVoted);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/nominations")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Logo size="sm" />
        </div>
        <div className="text-sm text-muted-foreground">
          {rankings.size} / {currentPool.votesPerParticipant} selected
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 pb-8">
        <div className="max-w-lg w-full mx-auto flex-1 flex flex-col">
          {/* Topic */}
          <h1 className="text-2xl font-bold text-foreground mb-2 animate-fade-in">
            {currentPool.topic}
          </h1>
          <p className="text-muted-foreground mb-6">
            Select your top {currentPool.votesPerParticipant} choices in order of preference
          </p>

          {/* Voting Cards */}
          <div className="flex-1 space-y-3 mb-6 overflow-y-auto">
            {currentPool.nominations.map((nomination, index) => (
              <VotingCard
                key={nomination.id}
                nominationText={nomination.text}
                rank={rankings.get(nomination.id) ?? null}
                isSelected={rankings.has(nomination.id)}
                onSelect={() => handleSelect(nomination.id)}
                index={index}
              />
            ))}
          </div>

          {/* Actions */}
          {hasVoted ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 p-4 bg-vote-success/10 rounded-xl border border-vote-success/30">
                <CheckCircle2 className="w-6 h-6 text-vote-success" />
                <span className="font-medium text-vote-success">Vote Submitted!</span>
              </div>
              
              {currentUser.isHost && (
                <Button
                  variant="hero"
                  size="lg"
                  onClick={handleEndVoting}
                  className="w-full"
                  disabled={!allVoted}
                >
                  {allVoted ? "End Voting & Show Results" : "Waiting for all votes..."}
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="hero"
              size="lg"
              onClick={handleSubmitVote}
              className="w-full"
              disabled={rankings.size !== currentPool.votesPerParticipant}
            >
              <Send className="w-5 h-5" />
              Submit Vote
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Voting;
