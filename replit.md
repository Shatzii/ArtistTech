# ProStudio - Music, DJ & Video Production Suite

## Overview

ProStudio is a comprehensive web-based music education and production platform that combines professional DAW capabilities, MPC-style beat making, live streaming classrooms, and structured music theory curriculum. Designed for both music production and education, it enables teachers to conduct live classes with real-time collaboration while students learn through interactive lessons, beat making, and hands-on music creation.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with custom studio theme variables
- **UI Components**: Radix UI components with shadcn/ui design system
- **State Management**: React hooks with @tanstack/react-query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Audio Processing**: Web Audio API for real-time audio manipulation

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript with ES modules
- **Development**: Vite for hot module replacement and fast builds
- **File Upload**: Multer middleware for handling audio/video files
- **Storage**: Configurable storage interface (currently in-memory, designed for PostgreSQL)

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Management**: Drizzle Kit for migrations and schema management
- **File Storage**: Local filesystem with configurable upload directory
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple

## Key Components

### Live Streaming Education Platform
- **Teacher Portal**: Full-featured streaming interface with classroom management
- **Student Dashboard**: Real-time class participation with audio/video controls
- **WebSocket Integration**: Real-time communication for chat, media controls, and content sharing
- **Authentication System**: Separate teacher and student login with demo accounts

### MPC Beats Production Suite
- **16-Pad Drum Machine**: Color-coded pads with keyboard shortcuts (QWERTY layout)
- **Step Sequencer**: 16/32 step patterns with velocity control and real-time editing
- **Professional Mixer**: Individual track controls, mute/solo, pitch, pan, and volume faders
- **Sample Library**: Organized sample packs by genre (Hip-Hop, Trap, Techno)
- **Effects Rack**: Reverb, delay, filter, compressor, and ADSR envelope controls

### Audio Engine (`useAudioEngine` hook)
- Web Audio API integration for low-latency audio processing
- Real-time playback controls (play, pause, stop, record)
- Master volume and BPM controls
- Audio file loading and buffering

### Educational System
- **Structured Curriculum**: K-12 music theory program with grade levels and progression tracking
- **Voice Commands**: Hands-free operation during lessons with natural language processing
- **Video Monitoring**: Real-time teacher demonstrations with student observation
- **Progress Tracking**: Comprehensive analytics for lesson completion and skill development

### Live Classroom Features
- **Real-time Video Streaming**: Teacher broadcasts with student participation
- **Interactive Chat**: Text messaging during live classes
- **Content Sharing**: Real-time sharing of audio files, projects, and lesson materials
- **Student Management**: Mute/unmute controls, hand raising, and individual student monitoring
- **Session Recording**: Automatic class recording for later review

### Database Schema
- **Projects**: Store project metadata and configuration
- **AudioFiles**: Track uploaded audio files with metadata
- **VideoFiles**: Manage video assets with properties
- **Teachers/Students**: User authentication and profile management
- **Classrooms**: Live streaming room management with participant tracking
- **ClassroomSessions**: Session history and recording metadata
- **SharedContent**: Real-time content sharing between teachers and students
- **Shared Types**: Type-safe schema definitions with Zod validation

## Data Flow

1. **File Upload**: User uploads audio/video files through the interface
2. **Processing**: Files are analyzed for metadata (BPM, duration, format)
3. **Storage**: File metadata stored in database, actual files in filesystem
4. **Project Management**: Projects link to files and store timeline configurations
5. **Real-time Playback**: Audio engine loads and plays files based on timeline data
6. **Effects Processing**: Audio routing through Web Audio API effects chain

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connection for PostgreSQL
- **drizzle-orm**: Type-safe database queries and migrations
- **@tanstack/react-query**: Server state management and caching
- **multer**: File upload handling middleware

### UI Framework
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management

### Audio/Media Processing
- **Web Audio API**: Browser-native audio processing
- **Canvas API**: Waveform visualization and audio meters

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Vite dev server
- **Database**: PostgreSQL 16 (configured in .replit)
- **File Storage**: Local uploads directory
- **Hot Reload**: Vite HMR for instant development feedback

### Production Build
- **Frontend**: Vite build to static assets
- **Backend**: ESBuild bundle for optimized server deployment
- **Database**: PostgreSQL with connection pooling
- **Scaling**: Configured for autoscale deployment target

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Development**: `npm run dev` with port 5000

## Changelog

```
Changelog:
- June 19, 2025. Added comprehensive MPC Beats-style interface with drum pads, sequencer, mixer, and effects
- June 19, 2025. Created structured music theory curriculum for K-12 education
- June 19, 2025. Integrated voice commands and video monitoring for educational lessons
- June 18, 2025. Initial setup
```

## Business Strategy & Monetization

### Licensing Tiers for Music Schools
- **Basic School License**: $2,500/year + $15/student/month (1-50 students)
- **Professional School License**: $8,500/year + $12/student/month (51-200 students)
- **Enterprise School License**: $25,000/year + $8/student/month (201+ students)
- **Franchise/White-Label License**: $50,000 initial + $2,000/month + 5% revenue share

### WordPress Integration Options
- **WordPress Plugin**: $497-$4,997/year per site (2-3 month development)
- **WordPress Theme Framework**: $40,000-$60,000 development investment
- **Headless WordPress + API**: $60,000-$85,000 enterprise solution

### Revenue Projections
- **Year 1 Target**: $3.2M annual recurring revenue (50 schools)
- **Year 3 Target**: $32M annual recurring revenue (500 schools)
- **WordPress Plugin Revenue**: $1.3M by Year 3
- **Platform Licensing**: $720K by Year 2

## Future Development Roadmap

### Immediate Priorities (Phase 1)
- WordPress plugin development for market expansion
- Business licensing program launch
- Sales team establishment and training

### Medium-term Goals (Phase 2-3)
- AI-powered music theory assistant with OpenAI integration
- Advanced assessment system with audio analysis and progress tracking
- International market expansion and localization
- Mobile app integration for practice on-the-go

### Long-term Vision (Phase 4)
- Virtual reality music education environments
- Advanced AI personalization and adaptive learning
- Professional studio-grade features and hardware integration
- Global franchise network with 1000+ locations

## User Preferences

```
Preferred communication style: Simple, everyday language.
```