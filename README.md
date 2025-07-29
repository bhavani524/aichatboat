# AI Chatbot Application

A modern, full-featured AI chatbot application built with Angular, featuring user authentication, chat history, and profile management.

## 🚀 Features

### 🔐 Authentication
- **User Registration**: Sign up with email and password
- **Secure Login**: JWT-based authentication
- **Session Management**: Automatic token handling and logout

### 💬 Chat System
- **AI Integration**: Chat with AI assistants (ChatGPT/Gemini API ready)
- **Real-time Messaging**: Instant message exchange
- **Message Management**: Delete individual messages
- **Chat History**: Save and retrieve past conversations
- **Multiple Chats**: Support for multiple chat sessions

### 👤 User Profile
- **Profile Management**: Update name and email
- **Password Change**: Secure password updates
- **Account Deletion**: Complete data removal option

### 🎨 Modern UI/UX
- **Material Design**: Clean, modern interface using Angular Material
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Automatic theme support
- **Smooth Animations**: Polished user interactions

## 🛠 Tech Stack

### Frontend
- **Angular 20**: Latest Angular framework
- **Angular Material**: UI component library
- **TypeScript**: Type-safe development
- **RxJS**: Reactive programming
- **Angular Router**: Navigation management

### Backend Integration Ready
- **HTTP Client**: API communication setup
- **JWT Interceptor**: Automatic token handling
- **Error Handling**: Comprehensive error management
- **Loading States**: User feedback during operations

## 📱 Pages & Components

1. **Login Page** (`/login`)
   - Email/password authentication
   - Form validation
   - Error handling

2. **Registration Page** (`/register`)
   - User account creation
   - Password confirmation
   - Input validation

3. **Chat Interface** (`/chat`)
   - Message exchange
   - Typing indicators
   - Message deletion
   - User menu with options

4. **Chat History** (`/history`)
   - View all past conversations
   - Delete individual chats
   - Clear all history
   - Search and filter (ready for implementation)

5. **Profile Settings** (`/profile`)
   - Update personal information
   - Change password
   - Delete account
   - Security settings

## 🔧 Setup & Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🌐 API Integration

The application is ready for backend integration with the following endpoints:

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Chat Endpoints
- `POST /api/chat/send-message` - Send message to AI
- `GET /api/chat/history` - Get chat history
- `GET /api/chat/:id` - Get specific chat
- `DELETE /api/chat/:id` - Delete chat
- `DELETE /api/chat/clear-history` - Clear all history

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `DELETE /api/user/account` - Delete account

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Route Guards**: Protected routes for authenticated users
- **HTTP Interceptors**: Automatic token attachment
- **Input Validation**: Client-side form validation
- **XSS Protection**: Safe content rendering

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Adapted layouts for tablets
- **Desktop Experience**: Full-featured desktop interface
- **Touch-Friendly**: Large touch targets and gestures

## 🎯 Future Enhancements

- **Voice Input**: Speech-to-text integration
- **File Uploads**: Image and document sharing
- **Chat Export**: Download conversations
- **Push Notifications**: Real-time alerts
- **Themes**: Custom color schemes
- **Multi-language**: Internationalization support

## 🚀 Deployment Ready

The application is configured for easy deployment to:
- **Netlify**: Static hosting
- **Vercel**: Serverless deployment
- **AWS S3**: Cloud storage
- **Firebase Hosting**: Google Cloud platform

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support and questions, please open an issue in the repository.