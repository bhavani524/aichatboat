import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Chat, ChatRequest, ChatResponse, Message } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly API_URL = 'http://localhost:3000/api';
  private currentChatSubject = new BehaviorSubject<Chat | null>(null);
  public currentChat$ = this.currentChatSubject.asObservable();

  constructor(private http: HttpClient) {}

  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.API_URL}/chat/send-message`, request);
  }

  getChatHistory(): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${this.API_URL}/chat/history`);
  }

  getChat(chatId: string): Observable<Chat> {
    return this.http.get<Chat>(`${this.API_URL}/chat/${chatId}`);
  }

  deleteMessage(chatId: string, messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/chat/${chatId}/message/${messageId}`);
  }

  deleteChat(chatId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/chat/${chatId}`);
  }

  clearAllHistory(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/chat/clear-history`);
  }

  setCurrentChat(chat: Chat | null): void {
    this.currentChatSubject.next(chat);
  }

  getCurrentChat(): Chat | null {
    return this.currentChatSubject.value;
  }
}