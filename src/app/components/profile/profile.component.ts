import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
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
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="profile-container">
      <mat-toolbar color="primary" class="profile-header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span class="profile-title">Profile Settings</span>
      </mat-toolbar>

      <div class="profile-content">
        <mat-card class="profile-card">
          <mat-card-header>
            <div mat-card-avatar class="profile-avatar">
              <mat-icon>person</mat-icon>
            </div>
            <mat-card-title>{{currentUser?.name}}</mat-card-title>
            <mat-card-subtitle>{{currentUser?.email}}</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="profile-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="name" placeholder="Enter your full name">
                <mat-icon matSuffix>person</mat-icon>
                <mat-error *ngIf="profileForm.get('name')?.hasError('required')">
                  Name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="Enter your email">
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="profileForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="profileForm.get('email')?.hasError('email')">
                  Please enter a valid email
                </mat-error>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" 
                        [disabled]="profileForm.invalid || isUpdating">
                  <mat-icon *ngIf="isUpdating">hourglass_empty</mat-icon>
                  {{isUpdating ? 'Updating...' : 'Update Profile'}}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <mat-card class="password-card">
          <mat-card-header>
            <mat-card-title>Change Password</mat-card-title>
            <mat-card-subtitle>Update your account password</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="password-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Current Password</mat-label>
                <input matInput [type]="hideCurrentPassword ? 'password' : 'text'" 
                       formControlName="currentPassword" placeholder="Enter current password">
                <button mat-icon-button matSuffix (click)="hideCurrentPassword = !hideCurrentPassword" type="button">
                  <mat-icon>{{hideCurrentPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                  Current password is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>New Password</mat-label>
                <input matInput [type]="hideNewPassword ? 'password' : 'text'" 
                       formControlName="newPassword" placeholder="Enter new password">
                <button mat-icon-button matSuffix (click)="hideNewPassword = !hideNewPassword" type="button">
                  <mat-icon>{{hideNewPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                  New password is required
                </mat-error>
                <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                  Password must be at least 6 characters
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Confirm New Password</mat-label>
                <input matInput [type]="hideConfirmPassword ? 'password' : 'text'" 
                       formControlName="confirmPassword" placeholder="Confirm new password">
                <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword" type="button">
                  <mat-icon>{{hideConfirmPassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                  Please confirm your new password
                </mat-error>
                <mat-error *ngIf="passwordForm.hasError('passwordMismatch')">
                  Passwords do not match
                </mat-error>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button color="accent" type="submit" 
                        [disabled]="passwordForm.invalid || isChangingPassword">
                  <mat-icon *ngIf="isChangingPassword">hourglass_empty</mat-icon>
                  {{isChangingPassword ? 'Changing...' : 'Change Password'}}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>

        <mat-card class="danger-card">
          <mat-card-header>
            <mat-card-title class="danger-title">Danger Zone</mat-card-title>
            <mat-card-subtitle>Irreversible actions</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <p class="danger-text">
              Once you delete your account, there is no going back. 
              All your data including chat history will be permanently deleted.
            </p>
            <button mat-raised-button color="warn" (click)="confirmDeleteAccount()">
              <mat-icon>delete_forever</mat-icon>
              Delete Account
            </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .profile-header {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 10;
    }

    .profile-title {
      font-size: 20px;
      font-weight: 500;
      margin-left: 16px;
    }

    .profile-content {
      flex: 1;
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
    }

    .profile-card, .password-card, .danger-card {
      margin-bottom: 24px;
    }

    .profile-avatar {
      background-color: #667eea;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .profile-form, .password-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-top: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    }

    .danger-card {
      border: 1px solid #f44336;
    }

    .danger-title {
      color: #f44336;
    }

    .danger-text {
      color: #666;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .profile-content {
        padding: 16px;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  currentUser: User | null = null;
  isUpdating = false;
  isChangingPassword = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name,
        email: this.currentUser.email
      });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isUpdating = true;
      
      this.authService.updateProfile(this.profileForm.value).subscribe({
        next: (user) => {
          this.currentUser = user;
          this.isUpdating = false;
          this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.isUpdating = false;
          this.snackBar.open(error.error?.message || 'Failed to update profile', 'Close', { duration: 3000 });
        }
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isChangingPassword = true;
      
      // Simulate password change API call
      setTimeout(() => {
        this.isChangingPassword = false;
        this.passwordForm.reset();
        this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 });
      }, 2000);
    }
  }

  confirmDeleteAccount(): void {
    const confirmed = confirm(
      'Are you absolutely sure you want to delete your account? ' +
      'This action cannot be undone and all your data will be permanently deleted.'
    );
    
    if (confirmed) {
      const doubleConfirmed = confirm(
        'This is your final warning. Your account and all associated data will be permanently deleted. ' +
        'Are you sure you want to proceed?'
      );
      
      if (doubleConfirmed) {
        this.deleteAccount();
      }
    }
  }

  deleteAccount(): void {
    this.authService.deleteAccount().subscribe({
      next: () => {
        this.snackBar.open('Account deleted successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to delete account', 'Close', { duration: 3000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/chat']);
  }
}