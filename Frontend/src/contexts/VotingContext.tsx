import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  hasVoted: boolean;
}

export interface Nomination {
  id: string;
  text: string;
  creatorId: string;
  creatorName: string;
}

export interface Vote {
participantId: string;
  rankings: { nominationId: string; rank: number }[];
}

export interface Pool {
  id: string;
  topic: string;
  votesPerParticipant: number;
  hostId: string;
  phase: 'waiting' | 'nominations' | 'voting' | 'results';
  participants: Participant[];
  nominations: Nomination[];
  votes: Vote[];
}

interface VotingContextType {
  currentUser: Participant | null;
  currentPool: Pool | null;
  setCurrentUser: (user: Participant | null) => void;
  createPool: (topic: string, votesPerParticipant: number, hostName: string) => string;
  joinPool: (poolId: string, userName: string) => boolean;
  addNomination: (text: string) => void;
  removeNomination: (nominationId: string) => void;
  startNominations: () => void;
  startVoting: () => void;
  submitVote: (rankings: { nominationId: string; rank: number }[]) => void;
  endVoting: () => void;
  resetAll: () => void;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

const generatePoolId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const generateUserId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const VotingProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);
  const [currentPool, setCurrentPool] = useState<Pool | null>(null);

  const createPool = (topic: string, votesPerParticipant: number, hostName: string): string => {
    const poolId = generatePoolId();
    const hostId = generateUserId();
    const host: Participant = {
      id: hostId,
      name: hostName,
      isHost: true,
      hasVoted: false,
    };

    const newPool: Pool = {
      id: poolId,
      topic,
      votesPerParticipant,
      hostId,
      phase: 'waiting',
      participants: [host],
      nominations: [],
      votes: [],
    };

    setCurrentPool(newPool);
    setCurrentUser(host);
    return poolId;
  };

  const joinPool = (poolId: string, userName: string): boolean => {
    if (!currentPool || currentPool.id !== poolId) {
      // In a real app, we'd fetch the pool from a server
      // For demo, we'll just return false
      return false;
    }

    const userId = generateUserId();
    const newParticipant: Participant = {
      id: userId,
      name: userName,
      isHost: false,
      hasVoted: false,
    };

    setCurrentPool(prev => prev ? {
      ...prev,
      participants: [...prev.participants, newParticipant],
    } : null);
    setCurrentUser(newParticipant);
    return true;
  };

  const addNomination = (text: string) => {
    if (!currentUser || !currentPool) return;

    const nomination: Nomination = {
      id: generateUserId(),
      text,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
    };

    setCurrentPool(prev => prev ? {
      ...prev,
      nominations: [...prev.nominations, nomination],
    } : null);
  };

  const removeNomination = (nominationId: string) => {
    if (!currentUser || !currentPool) return;

    const nomination = currentPool.nominations.find(n => n.id === nominationId);
    if (!nomination) return;

    // Only host or creator can remove
    if (currentUser.isHost || nomination.creatorId === currentUser.id) {
      setCurrentPool(prev => prev ? {
        ...prev,
        nominations: prev.nominations.filter(n => n.id !== nominationId),
      } : null);
    }
  };

  const startNominations = () => {
    setCurrentPool(prev => prev ? { ...prev, phase: 'nominations' } : null);
  };

  const startVoting = () => {
    setCurrentPool(prev => prev ? { ...prev, phase: 'voting' } : null);
  };

  const submitVote = (rankings: { nominationId: string; rank: number }[]) => {
    if (!currentUser || !currentPool) return;

    const vote: Vote = {
      participantId: currentUser.id,
      rankings,
    };

    setCurrentPool(prev => prev ? {
      ...prev,
      votes: [...prev.votes, vote],
    } : null);

    setCurrentUser(prev => prev ? { ...prev, hasVoted: true } : null);
    
    // Update participant in pool
    setCurrentPool(prev => prev ? {
      ...prev,
      participants: prev.participants.map(p => 
        p.id === currentUser.id ? { ...p, hasVoted: true } : p
      ),
    } : null);
  };

  const endVoting = () => {
    setCurrentPool(prev => prev ? { ...prev, phase: 'results' } : null);
  };

  const resetAll = () => {
    setCurrentPool(null);
    setCurrentUser(null);
  };

  return (
    <VotingContext.Provider value={{
      currentUser,
      currentPool,
      setCurrentUser,
      createPool,
      joinPool,
      addNomination,
      removeNomination,
      startNominations,
      startVoting,
      submitVote,
      endVoting,
      resetAll,
    }}>
      {children}
    </VotingContext.Provider>
  );
};

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};
