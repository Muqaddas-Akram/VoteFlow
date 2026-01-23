import { Trophy } from "lucide-react";

interface ResultBarProps {
  nomination: string;
  votes: number;
  totalVotes: number;
  rank: number;
  isWinner: boolean;
  index: number;
}

const ResultBar = ({ nomination, votes, totalVotes, rank, isWinner, index }: ResultBarProps) => {
  const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;

  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all animate-fade-in-up ${
        isWinner
          ? "border-vote-success bg-vote-success/5"
          : "border-border bg-card"
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              isWinner
                ? "bg-vote-success text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isWinner ? <Trophy className="w-4 h-4" /> : rank}
          </div>
          <span className={`font-medium ${isWinner ? "text-vote-success" : "text-foreground"}`}>
            {nomination}
          </span>
        </div>
        <span className="text-sm font-semibold text-muted-foreground">
          {votes} pts ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isWinner ? "bg-vote-success" : "bg-primary"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ResultBar;
