import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import NominationItem from "@/components/NominationItem";
import { useVoting } from "@/contexts/VotingContext";
import { PenLine, Plus, Play, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const Nominations = () => {
  const navigate = useNavigate();
  const { currentPool, currentUser, addNomination, removeNomination, startVoting } = useVoting();
  const [newNomination, setNewNomination] = useState("");

  useEffect(() => {
    if (!currentPool || !currentUser) {
      navigate("/");
    }
  }, [currentPool, currentUser, navigate]);

  if (!currentPool || !currentUser) {
    return null;
  }

  const handleAddNomination = () => {
    if (!newNomination.trim()) {
      toast.error("Please enter a nomination");
      return;
    }
    addNomination(newNomination.trim());
    setNewNomination("");
    toast.success("Nomination added!");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddNomination();
    }
  };

  const handleStartVoting = () => {
    if (currentPool.nominations.length < 2) {
      toast.error("Need at least 2 nominations to start voting");
      return;
    }
    startVoting();
    navigate("/voting");
  };

  const canDelete = (creatorId: string) => {
    return currentUser.isHost || creatorId === currentUser.id;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/waiting")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Logo size="sm" />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-vote-orange/20 rounded-lg">
          <PenLine className="w-4 h-4 text-vote-orange" />
          <span className="font-medium text-vote-orange">{currentPool.nominations.length}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 pb-8">
        <div className="max-w-lg w-full mx-auto flex-1 flex flex-col">
          {/* Topic */}
          <h1 className="text-2xl font-bold text-foreground mb-6 animate-fade-in">
            {currentPool.topic}
          </h1>

          {/* Add Nomination */}
          <div className="flex gap-2 mb-6 animate-fade-in-up">
            <Input
              placeholder="Add a nomination..."
              value={newNomination}
              onChange={(e) => setNewNomination(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-12"
            />
            <Button onClick={handleAddNomination} size="icon" className="h-12 w-12">
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {/* Nominations List */}
          <div className="flex-1 space-y-3 mb-6 overflow-y-auto">
            {currentPool.nominations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <PenLine className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No nominations yet. Be the first to add one!</p>
              </div>
            ) : (
              currentPool.nominations.map((nomination, index) => (
                <NominationItem
                  key={nomination.id}
                  text={nomination.text}
                  creatorName={nomination.creatorName}
                  canDelete={canDelete(nomination.creatorId)}
                  onDelete={() => removeNomination(nomination.id)}
                  index={index}
                />
              ))
            )}
          </div>

          {/* Host Actions */}
          {currentUser.isHost && (
            <Button
              variant="hero"
              size="lg"
              onClick={handleStartVoting}
              className="w-full"
              disabled={currentPool.nominations.length < 2}
            >
              <Play className="w-5 h-5" />
              Start Voting
            </Button>
          )}

          {!currentUser.isHost && (
            <div className="text-center p-4 bg-card rounded-xl border border-border">
              <p className="text-sm text-muted-foreground">
                Waiting for the host to start voting...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Nominations;
