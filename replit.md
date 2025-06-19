# ProStudio - Music, DJ & Video Production Suite

## Overview

ProStudio is a comprehensive web-based music production suite that combines DAW (Digital Audio Workstation), DJ mixing, and video editing capabilities in a single application. Built with modern web technologies, it provides professional-grade audio/video production tools accessible through a browser interface.

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

### Audio Engine (`useAudioEngine` hook)
- Web Audio API integration for low-latency audio processing
- Real-time playback controls (play, pause, stop, record)
- Master volume and BPM controls
- Audio file loading and buffering

### Studio Interface
- **TopMenuBar**: Project management and transport controls
- **LeftSidebar**: Mode selection (DAW/DJ/Video) and file browser
- **MainTimeline**: Multi-track timeline with drag-and-drop functionality
- **BottomControlPanel**: DJ mixing interface with dual decks and crossfader
- **RightSidebar**: Effects rack and master output controls

### File Management
- Multi-format audio file support (WAV, MP3, etc.)
- Video file handling for video production mode
- Drag-and-drop interface for timeline arrangement
- Audio analysis (BPM detection, waveform generation)

### Database Schema
- **Projects**: Store project metadata and configuration
- **AudioFiles**: Track uploaded audio files with metadata
- **VideoFiles**: Manage video assets with properties
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

## Future Development Roadmap

### Immediate Priorities (Phase 1)
- AI-powered music theory assistant with OpenAI integration
- Advanced assessment system with audio analysis and progress tracking
- Real-time collaborative learning features

### Medium-term Goals (Phase 2-3)
- Mobile app integration for practice on-the-go
- Gamified learning experience with achievements and challenges
- Professional content library with licensed backing tracks
- Enhanced voice command system with natural language processing

### Long-term Vision (Phase 4)
- Virtual reality music education environments
- Advanced AI personalization and adaptive learning
- Professional studio-grade features and hardware integration

## User Preferences

```
Preferred communication style: Simple, everyday language.
```