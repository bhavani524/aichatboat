export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface Chat {
  id: string;
  userId: string;
  messages: Message[];
  timestamp: Date;
  title?: string;
}

export interface ChatRequest {
  message: string;
  chatId?: string;
}

export interface ChatResponse {
  message: string;
  chatId: string;
}