import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Message, Chat } from '../../models/chat.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="chat-container">
      <mat-toolbar color="primary" class="chat-header">
        <mat-icon class="chat-logo">smart_toy</mat-icon>
        <span class="chat-title">AI Assistant</span>
        <span class="spacer"></span>
        <span class="user-name" *ngIf="currentUser">{{currentUser.name}}</span>
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="goToHistory()">
            <mat-icon>history</mat-icon>
            <span>Chat History</span>
          </button>
          <button mat-menu-item (click)="goToProfile()">
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item (click)="clearChat()">
            <mat-icon>clear_all</mat-icon>
            <span>Clear Chat</span>
          </button>
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <div class="chat-messages" #messagesContainer>
        <div class="welcome-message" *ngIf="messages.length === 0">
          <mat-icon class="welcome-icon">smart_toy</mat-icon>
          <h2>Welcome to AI Assistant!</h2>
          <p>Start a conversation by typing a message below.</p>
        </div>

        <div *ngFor="let message of messages; trackBy: trackByMessageId" 
             class="message-wrapper" 
             [ngClass]="{'user-message': message.isUser, 'bot-message': !message.isUser}">
          <div class="message-content">
            <div class="message-avatar">
              <mat-icon *ngIf="message.isUser">person</mat-icon>
              <mat-icon *ngIf="!message.isUser">smart_toy</mat-icon>
            </div>
            <div class="message-bubble">
              <p class="message-text">{{message.content}}</p>
              <span class="message-time">{{formatTime(message.timestamp)}}</span>
            </div>
            <button mat-icon-button class="delete-message" (click)="deleteMessage(message.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>

        <div *ngIf="isTyping" class="message-wrapper bot-message">
          <div class="message-content">
            <div class="message-avatar">
              <mat-icon>smart_toy</mat-icon>
            </div>
            <div class="message-bubble typing">
              <mat-spinner diameter="20"></mat-spinner>
              <span>AI is typing...</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat-input">
        <form [formGroup]="messageForm" (ngSubmit)="sendMessage()" class="input-form">
          <mat-form-field appearance="outline" class="message-field">
            <mat-label>Type your message...</mat-label>
            <input matInput formControlName="message" 
                   placeholder="Ask me anything!" 
                   (keydown.enter)="sendMessage()"
                   [disabled]="isTyping">
          </mat-form-field>
          <button mat-fab color="primary" type="submit" 
                  [disabled]="messageForm.invalid || isTyping"
                  class="send-button">
            <mat-icon>send</mat-icon>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: #f5f5f5;
    }

    .chat-header {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 10;
    }

    .chat-logo {
      margin-right: 8px;
    }

    .chat-title {
      font-size: 20px;
      font-weight: 500;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .user-name {
      margin-right: 16px;
      font-size: 14px;
      opacity: 0.9;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .welcome-message {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .welcome-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #667eea;
      margin-bottom: 16px;
    }

    .message-wrapper {
      display: flex;
      max-width: 80%;
    }

    .user-message {
      align-self: flex-end;
    }

    .bot-message {
      align-self: flex-start;
    }

    .message-content {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      width: 100%;
    }

    .user-message .message-content {
      flex-direction: row-reverse;
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #667eea;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .bot-message .message-avatar {
      background-color: #4caf50;
    }

    .message-bubble {
      background-color: white;
      border-radius: 18px;
      padding: 12px 16px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      max-width: 100%;
    }

    .user-message .message-bubble {
      background-color: #667eea;
      color: white;
    }

    .message-text {
      margin: 0 0 4px 0;
      word-wrap: break-word;
      line-height: 1.4;
    }

    .message-time {
      font-size: 11px;
      opacity: 0.7;
    }

    .typing {
      display: flex;
      align-items: center;
      gap: 8px;
      font-style: italic;
      opacity: 0.8;
    }

    .delete-message {
      opacity: 0;
      transition: opacity 0.2s;
      width: 24px;
      height: 24px;
    }

    .message-wrapper:hover .delete-message {
      opacity: 0.6;
    }

    .delete-message:hover {
      opacity: 1 !important;
    }

    .chat-input {
      padding: 16px 20px;
      background-color: white;
      border-top: 1px solid #e0e0e0;
    }

    .input-form {
      display: flex;
      align-items: flex-end;
      gap: 12px;
    }

    .message-field {
      flex: 1;
    }

    .send-button {
      width: 48px;
      height: 48px;
    }

    @media (max-width: 768px) {
      .message-wrapper {
        max-width: 95%;
      }
      
      .chat-input {
        padding: 12px 16px;
      }
    }
  `]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  messageForm: FormGroup;
  messages: Message[] = [];
  currentChat: Chat | null = null;
  currentUser: User | null = null;
  isTyping = false;

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadCurrentChat();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private loadCurrentChat(): void {
    this.chatService.currentChat$.subscribe(chat => {
      this.currentChat = chat;
      this.messages = chat?.messages || [];
    });
  }

  sendMessage(): void {
    if (this.messageForm.valid && !this.isTyping) {
      const messageContent = this.messageForm.value.message.trim();
      
      // Add user message immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        content: messageContent,
        isUser: true,
        timestamp: new Date()
      };
      
      this.messages.push(userMessage);
      this.messageForm.reset();
      this.isTyping = true;

      // Send to backend
      this.chatService.sendMessage({
        message: messageContent,
        chatId: this.currentChat?.id
      }).subscribe({
        next: (response) => {
          // Add bot response
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: response.message,
            isUser: false,
            timestamp: new Date()
          };
          
          this.messages.push(botMessage);
          this.isTyping = false;
        },
        error: (error) => {
          this.isTyping = false;
          this.snackBar.open('Failed to send message. Please try again.', 'Close', { duration: 3000 });
          console.error('Chat error:', error);
          
          // Add error message
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: 'Sorry, I encountered an error. Please try again.',
            isUser: false,
            timestamp: new Date()
          };
          
          this.messages.push(errorMessage);
        }
      });
    }
  }

  deleteMessage(messageId: string): void {
    this.messages = this.messages.filter(msg => msg.id !== messageId);
    this.snackBar.open('Message deleted', 'Close', { duration: 2000 });
  }

  clearChat(): void {
    this.messages = [];
    this.currentChat = null;
    this.chatService.setCurrentChat(null);
    this.snackBar.open('Chat cleared', 'Close', { duration: 2000 });
  }

  goToHistory(): void {
    this.router.navigate(['/history']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  trackByMessageId(index: number, message: Message): string {
    return message.id;
  }

  formatTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = 
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}