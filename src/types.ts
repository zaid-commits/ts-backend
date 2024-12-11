export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  username: string;
  timestamp: number;
}

export interface User {
  id: string;
  username: string;
}