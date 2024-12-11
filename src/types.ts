export interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  username: string;
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
}