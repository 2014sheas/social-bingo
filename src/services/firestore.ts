import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { User, Group, Game, Player, BingoCard } from "../types/firestore";

// User operations
export const createUser = async (
  userId: string,
  userData: Omit<User, "id">
) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    ...userData,
    id: userId,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  });
};

export const getUser = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? (userSnap.data() as User) : null;
};

// Group operations
export const createGroup = async (
  groupData: Omit<Group, "id" | "createdAt" | "memberCount">
) => {
  const groupRef = doc(collection(db, "groups"));
  await setDoc(groupRef, {
    ...groupData,
    id: groupRef.id,
    createdAt: serverTimestamp(),
    memberCount: 1,
  });

  // Add owner as first member
  const memberRef = doc(
    db,
    "groups",
    groupRef.id,
    "members",
    groupData.ownerId
  );
  await setDoc(memberRef, {
    userId: groupData.ownerId,
    role: "owner",
    joinedAt: serverTimestamp(),
  });

  return groupRef.id;
};

export const getGroup = async (groupId: string) => {
  const groupRef = doc(db, "groups", groupId);
  const groupSnap = await getDoc(groupRef);
  return groupSnap.exists() ? (groupSnap.data() as Group) : null;
};

export const getGroupMembers = async (groupId: string) => {
  const membersRef = collection(db, "groups", groupId, "members");
  const membersSnap = await getDocs(membersRef);
  return membersSnap.docs.map((doc) => doc.data());
};

// Game operations
export const createGame = async (gameData: Omit<Game, "id" | "createdAt">) => {
  const gameRef = doc(collection(db, "games"));
  await setDoc(gameRef, {
    ...gameData,
    id: gameRef.id,
    createdAt: serverTimestamp(),
  });
  return gameRef.id;
};

export const getGame = async (gameId: string) => {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);
  return gameSnap.exists() ? (gameSnap.data() as Game) : null;
};

export const getGroupGames = async (groupId: string) => {
  const gamesRef = collection(db, "games");
  const q = query(gamesRef, where("groupId", "==", groupId));
  const gamesSnap = await getDocs(q);
  return gamesSnap.docs.map((doc) => doc.data() as Game);
};

// Player operations
export const joinGame = async (playerData: Omit<Player, "joinedAt">) => {
  const playerRef = doc(
    db,
    "games",
    playerData.gameId,
    "players",
    playerData.userId
  );
  await setDoc(playerRef, {
    ...playerData,
    joinedAt: serverTimestamp(),
  });
};

export const updatePlayerCard = async (
  gameId: string,
  userId: string,
  card: Player["card"]
) => {
  const playerRef = doc(db, "games", gameId, "players", userId);
  await updateDoc(playerRef, { card });
};

export const markSquare = async (
  gameId: string,
  userId: string,
  squareId: string
) => {
  const playerRef = doc(db, "games", gameId, "players", userId);
  const playerSnap = await getDoc(playerRef);

  if (playerSnap.exists()) {
    const player = playerSnap.data() as Player;
    const updatedMarkedSquares = [...player.markedSquares, squareId];

    await updateDoc(playerRef, {
      markedSquares: updatedMarkedSquares,
      hasBingo: checkForBingo(updatedMarkedSquares, player.card),
    });
  }
};

// Helper functions
const checkForBingo = (markedSquares: string[], card: BingoCard): boolean => {
  // Implement bingo checking logic here
  // This is a placeholder - we'll implement the actual bingo checking logic later
  return false;
};
