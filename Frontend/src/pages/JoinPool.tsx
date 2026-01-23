import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const JoinPool = () => {
  const navigate = useNavigate();
  const [poolId, setPoolId] = useState("");
  const [userName, setUserName] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!poolId.trim()) {
      toast.error("Please enter a Pool ID");
      return;
    }
    if (!userName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    setIsJoining(true);
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo, show that joining would work
    toast.info("In a real app, you'd join the pool here. For demo, create a pool first!");
    setIsJoining(false);
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Join a Pool</h1>
          <p className="text-muted-foreground mb-8">Enter the Pool ID shared with you</p>

          <div className="space-y-6">
            {/* Pool ID Input */}
            <div className="space-y-2">
              <Label htmlFor="poolId">Pool ID</Label>
              <Input
                id="poolId"
                placeholder="Enter 6-character Pool ID"
                value={poolId}
                onChange={(e) => setPoolId(e.target.value.toUpperCase())}
                className="h-12 text-center font-mono text-lg tracking-widest uppercase"
                maxLength={6}
              />
            </div>

            {/* User Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                variant="hero"
                onClick={handleJoin}
                disabled={isJoining}
                className="flex-1"
              >
                {isJoining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Pool"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JoinPool;
