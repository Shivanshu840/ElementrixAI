# ElementrixAI

A full-stack AI-powered platform for generating React components through conversational UI. Built with Next.js, TypeScript, Prisma, and advanced AI technology.

![ElementrixAI Landing Page](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-29%20164741-zN5dhGNgGdwk4JARbJM4Nv277r0v00.png)

## 🚀 Features

### Core Features
- ✅ **Authentication & Persistence**: JWT-based auth with session management
- ✅ **Conversational UI**: Chat interface with AI-driven component generation  
- ✅ **Code Inspection & Export**: Syntax-highlighted code viewer with copy/download
- ✅ **Live Preview**: Sandboxed component rendering with real-time updates
- ✅ **Session Management**: Save, load, and resume work sessions
- ✅ **Iterative Refinement**: Modify components through follow-up prompts

### Authentication System
Multiple sign-in options for seamless access:

![Sign In Page](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-29%20164810-3Ha3A7QwAoZJxzMMtsNr7bIycpXi6Q.png)

- **OAuth Integration**: GitHub and Google sign-in
- **Credentials**: Traditional email/password authentication
- **Session Management**: Secure JWT-based sessions

### AI-Powered Chat Interface
Natural conversation with AI to generate components:

![Chat Interface](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-29%20164621-IUf3n3qaxgp9g9Yk6RMA9UyNiO2f0u.png)

- **Conversational UI**: Describe components in natural language
- **Context Awareness**: AI maintains conversation history
- **Real-time Responses**: Instant component generation

### Session History & Management
Organize and resume your work sessions:

![Session History](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-29%20164716-SIhY7HpkBsGid0bJiHbKfPjuQhForp.png)

- **Persistent Sessions**: Auto-save and resume functionality
- **Session Organization**: Easy access to previous work
- **Version Tracking**: Component iteration history

### Live Preview & Code Editor
See your components come to life:

![Live Preview](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-29%20164700-G1cs70OzM5jAjZvEUhsmPBydV3R90e.png)

![Code Editor](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-29%20164639-MpDPOO4WXhoH4AKTvJB8DM9cDY0v71.png)

- **Real-time Preview**: Instant component rendering
- **Syntax Highlighting**: Clean, readable code display
- **Export Options**: Copy to clipboard or download as files
- **Multiple Formats**: Support for React, TypeScript, and CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with OAuth providers
- **AI Integration**: Advanced AI models via AI SDK
- **State Management**: Zustand
- **Code Highlighting**: react-syntax-highlighter
- **Caching**: Redis for performance optimization

## 📦 Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd elementrix-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- `NEXTAUTH_URL`: Your application URL
- `AI_API_KEY`: Your AI service API key

4. **Set up the database**
```bash
npm run db:generate
npm run db:push
```

5. **Run the development server**
```bash
npm run dev
```

## 🏗️ Architecture

### Database Schema
- **Users**: Authentication and user management
- **Sessions**: Component generation sessions
- **ChatMessages**: Conversation history
- **Components**: Generated component code and metadata

### Key Features Implementation

#### Authentication System
- NextAuth.js with multiple providers
- Secure password hashing
- JWT session management
- Protected routes with middleware

#### AI Integration
- Advanced AI model integration
- Structured prompts for component generation
- JSON response parsing
- Error handling and fallbacks

#### Component Preview
- Secure iframe sandboxing
- Dynamic HTML generation
- Hot-reload functionality
- Responsive preview viewport

## 🚀 Deployment

### Environment Variables for Production
```env
# Database
DATABASE_URL="your-postgresql-url"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-secret-key"

# AI Service
AI_API_KEY="your-ai-api-key"

# OAuth (Optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Redis (Optional)
REDIS_URL="your-redis-url"
```

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

## 🔧 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
```

## 📊 Performance Features

- **Fast AI Responses**: Optimized AI integration for quick generation
- **Smart Caching**: Redis caching for improved performance
- **Session Persistence**: Automatic save and restore functionality
- **Real-time Updates**: Live preview with instant feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**ElementrixAI** - Generate React components through natural conversation with AI.
```

This cleaned-up README:

1. **Removes unnecessary content** like detailed technical specifications and redundant sections
2. **Adds all provided images** in relevant sections to showcase the platform
3. **Maintains professional structure** with clear sections and features
4. **Focuses on key benefits** and user experience
5. **Includes essential setup information** without overwhelming detail
6. **Uses proper image embedding** with the provided blob URLs
7. **Maintains consistent branding** with ElementrixAI throughout

The README now serves as an effective showcase of your platform's capabilities while being concise and user-friendly.