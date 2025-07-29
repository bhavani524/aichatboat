import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { Chat } from '../../models/chat.model';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="history-container">
      <mat-toolbar color="primary" class="history-header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span class="history-title">Chat History</span>
        <span class="spacer"></span>
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="clearAllHistory()">
            <mat-icon>delete_sweep</mat-icon>
            <span>Clear All History</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <div class="history-content">
        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Loading chat history...</p>
        </div>

        <div *ngIf="!isLoading && chats.length === 0" class="empty-state">
          <mat-icon class="empty-icon">chat_bubble_outline</mat-icon>
          <h2>No Chat History</h2>
          <p>Start a conversation to see your chat history here.</p>
          <button mat-raised-button color="primary" (click)="startNewChat()">
            <mat-icon>add</mat-icon>
            Start New Chat
          </button>
        </div>

        <div *ngIf="!isLoading && chats.length > 0" class="chats-grid">
          <mat-card *ngFor="let chat of chats; trackBy: trackByChatId" 
                    class="chat-card" 
                    (click)="openChat(chat)">
            <mat-card-header>
              <div mat-card-avatar class="chat-avatar">
                <mat-icon>chat</mat-icon>
              </div>
              <mat-card-title class="chat-title">
                {{chat.title || 'Chat Session'}}
              </mat-card-title>
              <mat-card-subtitle>
                {{formatDate(chat.timestamp)}}
              </mat-card-subtitle>
              <button mat-icon-button 
                      class="delete-chat-btn"
                      (click)="deleteChat(chat.id, $event)">
                <mat-icon>delete</mat-icon>
              </button>
            </mat-card-header>
            
            <mat-card-content>
              <div class="chat-preview">
                <div *ngIf="chat.messages.length > 0" class="last-message">
                  <strong *ngIf="chat.messages[chat.messages.length - 1].isUser">You:</strong>
                  <strong *ngIf="!chat.messages[chat.messages.length - 1].isUser">AI:</strong>
                  {{getPreviewText(chat.messages[chat.messages.length - 1].content)}}
                </div>
                <div class="message-count">
                  {{chat.messages.length}} message{{chat.messages.length !== 1 ? 's' : ''}}
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .history-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: #f5f5f5;
    }

    .history-header {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 10;
    }

    .history-title {
      font-size: 20px;
      font-weight: 500;
      margin-left: 16px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .history-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      gap: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .chats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .chat-card {
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .chat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .chat-avatar {
      background-color: #667eea;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chat-title {
      font-size: 16px;
      font-weight: 500;
    }

    .delete-chat-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .chat-card:hover .delete-chat-btn {
      opacity: 0.7;
    }

    .delete-chat-btn:hover {
      opacity: 1 !important;
      background-color: rgba(244, 67, 54, 0.1);
      color: #f44336;
    }

    .chat-preview {
      margin-top: 8px;
    }

    .last-message {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .message-count {
      font-size: 12px;
      color: #999;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .chats-grid {
        grid-template-columns: 1fr;
      }
      
      .history-content {
        padding: 16px;
      }
    }
  `]
})
export class HistoryComponent implements OnInit {
  chats: Chat[] = [];
  isLoading = true;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadChatHistory();
  }

  loadChatHistory(): void {
    this.isLoading = true;
    
    this.chatService.getChatHistory().subscribe({
      next: (chats) => {
        this.chats = chats.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to load chat history', 'Close', { duration: 3000 });
        console.error('History loading error:', error);
      }
    });
  }

  openChat(chat: Chat): void {
    this.chatService.setCurrentChat(chat);
    this.router.navigate(['/chat']);
  }

  deleteChat(chatId: string, event: Event): void {
    event.stopPropagation();
    
    if (confirm('Are you sure you want to delete this chat?')) {
      this.chatService.deleteChat(chatId).subscribe({
        next: () => {
          this.chats = this.chats.filter(chat => chat.id !== chatId);
          this.snackBar.open('Chat deleted successfully', 'Close', { duration: 2000 });
        },
        error: (error) => {
          this.snackBar.open('Failed to delete chat', 'Close', { duration: 3000 });
          console.error('Delete chat error:', error);
        }
      });
    }
  }

  clearAllHistory(): void {
    if (confirm('Are you sure you want to clear all chat history? This action cannot be undone.')) {
      this.chatService.clearAllHistory().subscribe({
        next: () => {
          this.chats = [];
          this.snackBar.open('All chat history cleared', 'Close', { duration: 2000 });
        },
        error: (error) => {
          this.snackBar.open('Failed to clear history', 'Close', { duration: 3000 });
          console.error('Clear history error:', error);
        }
      });
    }
  }

  startNewChat(): void {
    this.router.navigate(['/chat']);
  }

  goBack(): void {
    this.router.navigate(['/chat']);
  }

  trackByChatId(index: number, chat: Chat): string {
    return chat.id;
  }

  formatDate(timestamp: Date): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  getPreviewText(text: string): string {
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  }
}