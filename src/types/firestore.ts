export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: Date;
  memberCount: number;
}

export interface GroupMember {
  userId: string;
  role: "owner" | "member";
  joinedAt: Date;
}

export interface Game {
  id: string;
  groupId: string;
  name: string;
  type: "traditional" | "custom";
  status: "waiting" | "active" | "finished";
  ownerId: string;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
  winnerId?: string;
}

export interface TraditionalGame extends Game {
  type: "traditional";
  calledNumbers: number[];
  cardSize: number;
}

export interface CustomGame extends Game {
  type: "custom";
  customSquares: CustomSquare[];
}

export interface CustomSquare {
  id: string;
  text: string;
  verified: boolean;
  verifiedBy?: string;
}

export interface Player {
  userId: string;
  gameId: string;
  card: BingoCard;
  markedSquares: string[];
  hasBingo: boolean;
  joinedAt: Date;
}

export interface BingoCard {
  id: string;
  squares: BingoSquare[];
}

export interface BingoSquare {
  id: string;
  value: string | number;
  marked: boolean;
}
