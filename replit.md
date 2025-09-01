# Artist Tech - Music, DJ & Video Production Suite

## Overview

Artist Tech is a revolutionary platform that pays users to view and create content, disrupting traditional social media with a "pay to view" model. It combines 19 cutting-edge self-hosted AI engines with comprehensive social media management, aiming to replace platforms like TikTok, Instagram, YouTube, and Spotify. The platform offers significantly higher creator payouts ($50+ per 1K plays vs Spotify's $3) and seeks to establish a sustainable content consumption economy. It's designed as the world's first platform to achieve this, offering full-scale entertainment industry management for record labels and film production studios, including AI-powered talent discovery, artist development, global distribution, and financial analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

Artist Tech is built on a full-stack architecture designed for high performance, scalability, and real-time interaction.

### Frontend
- **Framework**: React 18 with TypeScript.
- **Styling**: Tailwind CSS with custom studio themes and Radix UI/shadcn/ui for components.
- **State Management**: React hooks with @tanstack/react-query.
- **Routing**: Wouter for client-side routing.
- **Audio Processing**: Web Audio API for real-time manipulation.
- **UI/UX**: Features a clean gradient design with purple/orange branding, mobile-responsive layouts, touch-optimized controls, PWA support, and adaptive components based on device performance. Professional categorized menus and real-time status indicators enhance navigation.
- **Collaborative Editing**: Advanced real-time multi-user editing with live cursor tracking, conflict resolution, and WebSocket-based synchronization across all creative applications.

### Backend
- **Runtime**: Node.js with Express server.
- **Language**: TypeScript with ES modules.
- **Development**: Vite for fast builds and hot module replacement.
- **File Upload**: Multer middleware.
- **Storage**: Configurable interface for local filesystem, designed for PostgreSQL.

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries.
- **Schema Management**: Drizzle Kit for migrations.
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple.

### Core Features & Technical Implementations
- **19 Self-Hosted AI Engines**: All AI processing runs locally without external API dependencies. These include Neural Audio Synthesis, Motion Capture, Advanced Video AI, Immersive Media Creation, Adaptive Learning AI, Professional MIDI Controller Integration, AI-Powered Business Management & Marketing, Self-Hosted Content Creation, AI Collaboration Partner, Voice-First Creation, Predictive Content Analytics, 3D Spatial Interface, Creative Economy, Advanced Audio Engine, Professional DAW Engine, Hardware Integration Engine, AI Collaborative Studio Engine, and Cross-Platform Export Engine.
- **Studio Suites**: Consists of 15+ functional studios (e.g., Music Studio, Video Studio, DJ Studio, Social Media Studio, Crypto Studio, VR Studio, Podcast Studio) with full backend API integration for real operations like play/pause, record, save, export, and real-time collaboration.
- **Authentication System**: Standard user and admin logins with dedicated dashboards.
- **Live Streaming Education Platform**: Teacher portal, student dashboard, WebSocket integration for real-time communication, and separate authentication for teachers and students.
- **MPC Beats Production Suite**: Features a 16-pad drum machine, step sequencer, professional mixer, sample library, and effects rack.
- **Audio Engine (`useAudioEngine` hook)**: Web Audio API integration for low-latency audio processing, playback controls, and master volume/BPM.
- **Educational System**: K-12 music theory curriculum, voice commands, video monitoring, and progress tracking.
- **Unified Studio System**: Consolidated multiple duplicate pages into comprehensive, unified interfaces (e.g., Unified DJ Studio, Unified Social Media Hub, Career Management Suite).
- **Mobile Optimization**: Advanced device detection, adaptive layouts, touch optimization, PWA support, and performance-based feature scaling.

## External Dependencies

- **Database Connectivity**: `@neondatabase/serverless`
- **ORM**: `drizzle-orm`
- **State Management**: `@tanstack/react-query`
- **File Upload**: `multer`
- **UI Libraries**: `@radix-ui/*`, `tailwindcss`, `class-variance-authority`
- **Browser APIs**: Web Audio API, Canvas API (for visualizations).