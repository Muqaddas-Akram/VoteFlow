import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import PoolIdDisplay from "@/components/PoolIdDisplay";
import ParticipantsList from "@/components/ParticipantsList";
import { useVoting } from "@/contexts/VotingContext";
import { Users, PenLine, Play, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const WaitingRoom = () => {
  const navigate = useNavigate();
  const { currentPool, currentUser, startNominations, resetAll } = useVoting();

  useEffect(() => {
    if (!currentPool || !currentUser) {
      navigate("/");
    }
  }, [currentPool, currentUser, navigate]);

  if (!currentPool || !currentUser) {
    return null;
  }

  const handleStartNominations = () => {
    startNominations();
    navigate("/nominations");
  };

  const handleLeave = () => {
    resetAll();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleLeave}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Logo size="sm" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 py-8">
        <div className="max-w-lg w-full animate-fade-in-up">
          {/* Topic */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8">
            {currentPool.topic}
          </h1>

          {/* Pool ID */}
          <div className="flex flex-col items-center mb-10">
            <p className="text-sm text-muted-foreground mb-3">Share this Pool ID</p>
            <PoolIdDisplay poolId={currentPool.id} />
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-10">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">{currentPool.participants.length}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="p-2 rounded-lg bg-vote-orange/20">
                <PenLine className="w-5 h-5 text-vote-orange" />
              </div>
              <span className="font-medium">{currentPool.nominations.length}</span>
            </div>
          </div>

          {/* Participants */}
          <div className="mb-10">
            <h2 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
              Participants
            </h2>
            <ParticipantsList participants={currentPool.participants} />
          </div>

          {/* Host Actions */}
          {currentUser.isHost && (
            <Button
              variant="hero"
              size="lg"
              onClick={handleStartNominations}
              className="w-full"
            >
              <Play className="w-5 h-5" />
              Start Nominations
            </Button>
          )}

          {!currentUser.isHost && (
            <div className="text-center p-6 bg-card rounded-xl border border-border">
              <p className="text-muted-foreground">
                Waiting for the host to start nominations...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WaitingRoom;
