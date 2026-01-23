import { User, Crown } from "lucide-react";
import { Participant } from "@/contexts/VotingContext";

interface ParticipantsListProps {
  participants: Participant[];
  showVoteStatus?: boolean;
}

const ParticipantsList = ({ participants, showVoteStatus = false }: ParticipantsListProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {participants.map((participant, index) => (
        <div
          key={participant.id}
          className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className={`p-1.5 rounded-full ${participant.isHost ? 'bg-vote-orange/20' : 'bg-primary/10'}`}>
            {participant.isHost ? (
              <Crown className="w-4 h-4 text-vote-orange" />
            ) : (
              <User className="w-4 h-4 text-primary" />
            )}
          </div>
          <span className="text-sm font-medium text-foreground">{participant.name}</span>
          {showVoteStatus && (
            <div className={`w-2 h-2 rounded-full ${participant.hasVoted ? 'bg-vote-success' : 'bg-muted'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ParticipantsList;
