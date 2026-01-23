import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NominationItemProps {
  text: string;
  creatorName: string;
  canDelete: boolean;
  onDelete: () => void;
  index: number;
}

const NominationItem = ({ text, creatorName, canDelete, onDelete, index }: NominationItemProps) => {
  return (
    <div 
      className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-all duration-200 animate-fade-in-up shadow-sm"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex-1">
        <p className="font-medium text-foreground">{text}</p>
        <p className="text-sm text-muted-foreground mt-1">by {creatorName}</p>
      </div>
      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default NominationItem;
