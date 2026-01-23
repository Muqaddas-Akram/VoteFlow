import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { useVoting } from "@/contexts/VotingContext";
import { ArrowLeft, Plus, Minus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CreatePool = () => {
  const navigate = useNavigate();
  const { createPool } = useVoting();
  
  const [topic, setTopic] = useState("");
  const [votesPerParticipant, setVotesPerParticipant] = useState(3);
  const [hostName, setHostName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a pool topic");
      return;
    }
    if (!hostName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsCreating(true);
    
    // Simulate slight delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const poolId = createPool(topic.trim(), votesPerParticipant, hostName.trim());
    toast.success(`Pool created! ID: ${poolId}`);
    navigate("/waiting");
    
    setIsCreating(false);
  };

  const handleReset = () => {
    setTopic("");
    setVotesPerParticipant(3);
    setHostName("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Logo size="sm" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="max-w-md w-full animate-fade-in-up">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create a Pool</h1>
          <p className="text-muted-foreground mb-8">Set up your voting topic and preferences</p>

          <div className="space-y-6">
            {/* Topic Input */}
            <div className="space-y-2">
              <Label htmlFor="topic">Pool Topic</Label>
              <Input
                id="topic"
                placeholder="What should we decide on?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Votes Per Participant */}
            <div className="space-y-2">
              <Label>Votes Per Participant</Label>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setVotesPerParticipant(Math.max(1, votesPerParticipant - 1))}
                  disabled={votesPerParticipant <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-center">
                  <span className="text-4xl font-bold text-foreground">{votesPerParticipant}</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {votesPerParticipant === 1 ? "vote" : "votes"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setVotesPerParticipant(Math.min(10, votesPerParticipant + 1))}
                  disabled={votesPerParticipant >= 10}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Host Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
              >
                Start Over
              </Button>
              <Button
                variant="hero"
                onClick={handleCreate}
                disabled={isCreating}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Pool"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePool;
