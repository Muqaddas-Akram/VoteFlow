import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { Plus, Users, ArrowRight, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Logo size="md" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="max-w-lg w-full text-center animate-fade-in-up">
          {/* Hero Icon */}
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 animate-pulse-soft">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Decide Together,
            <span className="text-primary"> Instantly</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            Create and participate in real-time ranked voting. Perfect for teams, friends, and any group decision.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="hero"
              size="lg"
              onClick={() => navigate("/create")}
              className="group"
            >
              <Plus className="w-5 h-5" />
              Create New Pool
              <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </Button>
            <Button
              variant="hero-outline"
              size="lg"
              onClick={() => navigate("/join")}
              className="group"
            >
              <Users className="w-5 h-5" />
              Join Existing Pool
              <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {[
            { title: "Quick Setup", desc: "Create a pool in seconds" },
            { title: "Real-time", desc: "See participants join live" },
            { title: "Fair Voting", desc: "Ranked choice results" },
          ].map((feature, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-xl bg-card border border-border"
            >
              <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Landing;
