# Overview

This is a full-stack web application that creates interactive visual stories by analyzing uploaded images with AI. Users can upload images which are processed using OpenAI's GPT-4 Vision API to generate creative narratives, identify connections between images, and build continuous storytelling experiences. The application features a modern React frontend with shadcn/ui components and an Express.js backend with PostgreSQL database integration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript and Vite for development
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **File Uploads**: Uppy library with dashboard interface for file management

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **File Storage**: Google Cloud Storage integration with custom ACL policies
- **AI Integration**: OpenAI GPT-4 Vision API for image analysis and narrative generation
- **Authentication**: Basic user system with username/password (schema defined but not fully implemented)
- **Development**: Hot reload with Vite integration in development mode

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon Database serverless connection
- **Schema Design**: 
  - Users table for authentication
  - Story chapters table linking images to narratives with metadata
  - JSON fields for storing arrays (connections, tags)
- **File Storage**: Google Cloud Storage with custom object ACL policies for access control
- **Development Storage**: In-memory storage implementation for development/testing

## Authentication and Authorization
- **User Management**: Basic username/password system (schema exists, implementation pending)
- **Object Access Control**: Custom ACL policy system for file access with configurable permission groups
- **File Security**: Integration with Google Cloud Storage authentication via Replit sidecar

## Key Features
- **Image Analysis**: AI-powered narrative generation from uploaded images
- **Story Continuity**: Maintains context across multiple image uploads to create cohesive stories
- **Rich Metadata**: Extracts themes, tags, and connections between story chapters
- **Responsive Design**: Mobile-friendly interface with adaptive components
- **Real-time Feedback**: Toast notifications and loading states for user interactions

# External Dependencies

## Cloud Services
- **Neon Database**: Serverless PostgreSQL database hosting
- **Google Cloud Storage**: Object storage service for image files
- **OpenAI API**: GPT-4 Vision model for image analysis and story generation
- **Replit Infrastructure**: Sidecar service for Google Cloud credentials

## Key Libraries
- **Frontend**: React, TanStack Query, Wouter, Uppy, shadcn/ui, Tailwind CSS
- **Backend**: Express.js, Drizzle ORM, Multer for file uploads
- **Development**: Vite, TypeScript, ESBuild for production builds
- **UI Components**: Extensive Radix UI component library for accessible interfaces

## Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **Database Management**: Drizzle Kit for schema migrations and database operations
- **Code Quality**: TypeScript with strict configuration and path mapping
- **Asset Handling**: Custom alias configuration for clean imports