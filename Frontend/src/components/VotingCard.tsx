import { GripVertical } from "lucide-react";

interface VotingCardProps {
  nominationText: string;
  rank: number | null;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const VotingCard = ({ nominationText, rank, isSelected, onSelect, index }: VotingCardProps) => {
  return (
    <button
      onClick={onSelect}
      className={`flex items-center gap-4 w-full p-4 rounded-xl border-2 transition-all duration-200 text-left animate-fade-in-up ${
        isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
      }`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="text-muted-foreground">
        <GripVertical className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{nominationText}</p>
      </div>
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
          rank !== null
            ? "bg-primary text-primary-foreground"
            : "bg-muted/50 text-muted-foreground"
        }`}
      >
        {rank !== null ? rank : "-"}
      </div>
    </button>
  );
};

export default VotingCard;
