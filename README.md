# 🍊 Joe & The Juice - Store Management System

A comprehensive store performance and employee management system built for Joe & The Juice's growing network of juice bars across multiple countries.

## 🎯 Project Overview

This project demonstrates a complete full-stack application suitable for a backend developer interview at Joe & The Juice. It showcases:

- **Backend**: NestJS + TypeScript + GraphQL + PostgreSQL
- **Frontend**: Vanilla JavaScript (mobile-first, no frameworks)
- **Database**: Supabase (PostgreSQL with SSL)
- **Architecture**: Modern, scalable, production-ready

## 🏗️ Architecture

### Backend (NestJS)
- **GraphQL API** with auto-generated schema
- **TypeORM** for database management
- **Modular architecture** (stores, employees, analytics)
- **SSL-enabled** Supabase connection
- **Environment-based** configuration

### Frontend (Vanilla JS)
- **Mobile-first** responsive design
- **Single-page application** with routing
- **Real-time data** with GraphQL client
- **Progressive Web App** features
- **Joe & The Juice branding** and UX

### Database (Supabase)
- **PostgreSQL** with proper relationships
- **Entity management** for stores and employees
- **Performance tracking** and analytics
- **Multi-country support**

## 🚀 Features

### 📊 Dashboard
- Performance metrics overview
- Top performing stores visualization
- Global performance by country
- Revenue and employee analytics

### 🏪 Store Management
- Complete CRUD operations
- Search and filtering
- Performance tracking
- Multi-country store locations
- Manager assignments

### 👥 Employee Management
- Full employee lifecycle management
- Performance scoring system
- Role-based filtering (Managers, Baristas, etc.)
- Store assignments and relationships
- Salary and hours tracking

### 📈 Analytics
- Performance vs revenue correlation
- Country-wise breakdown
- Employee performance insights
- Trend analysis with projections
- Business intelligence reports

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **GraphQL** - Query language for APIs
- **TypeORM** - Object-relational mapping
- **PostgreSQL** - Relational database
- **TypeScript** - Type-safe JavaScript

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **Modern CSS** - Custom properties, Grid, Flexbox
- **Progressive Web App** - Offline capabilities
- **Responsive Design** - Mobile-first approach

### Infrastructure
- **Supabase** - Backend-as-a-Service
- **SSL/TLS** - Secure connections
- **Environment Config** - Flexible deployment

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### 1. Clone and Install
```bash
git clone <repository-url>
cd joe-store-manager

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### 2. Database Setup
The project is configured to use Supabase with the provided connection string:
```
postgresql://postgres:joeandthejuice@db.hjoapbjyztbikulyzalx.supabase.co:5432/postgres
```

### 3. Backend Configuration
The backend is already configured in `backend/config.env`:
```env
# Supabase Database Configuration
DB_HOST=db.hjoapbjyztbikulyzalx.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=joeandthejuice
DB_NAME=postgres
DB_TYPE=postgres
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
```

### 4. Seed Database (Optional)
To populate with realistic test data:
```sql
-- Run the SQL commands in backend/src/database/seed.sql
-- in your Supabase SQL editor or preferred PostgreSQL client
```

### 5. Start Development Servers

**Backend (Port 3000):**
```bash
cd backend
npm run start:dev
```

**Frontend (Port 5173):**
```bash
cd frontend  
npm run dev
```

### 6. Access Application
- **Frontend**: http://localhost:5173
- **GraphQL Playground**: http://localhost:3000/graphql

## 🏢 Business Context

This system addresses Joe & The Juice's real business needs:

### Current Scale
- **400+ stores** globally
- **Multiple countries** (Denmark, UK, US, Sweden, Germany)
- **Rapid expansion** targeting 1,000 stores by 2028

### Key Challenges Solved
- **Performance monitoring** across all locations
- **Employee management** and performance tracking
- **Multi-country operations** with localized data
- **Scalable architecture** for growth
- **Real-time dashboards** for decision making

### Team Leadership Aspects
- **Clean, maintainable code** for team collaboration
- **Modular architecture** for easy feature additions
- **Comprehensive documentation** for onboarding
- **Best practices** and design patterns
- **Scalable database design** for growth

## 🎨 UI/UX Features

### Mobile-First Design
- **Responsive layouts** across all devices
- **Touch-friendly** interactions
- **Progressive Web App** installable on mobile

### Joe & The Juice Branding
- **Orange primary color** (#FF6B35)
- **Modern typography** (Inter font family)
- **Clean, minimalist design**
- **Consistent iconography**

### User Experience
- **Intuitive navigation** with clear sections
- **Search and filtering** for quick data access
- **Toast notifications** for user feedback
- **Loading states** and error handling
- **Smooth animations** and transitions

## 📊 Demo Data

The application includes realistic demo data representing:

### Stores (12 locations)
- **Denmark**: Copenhagen Central, Aarhus C, Odense City
- **UK**: London Shoreditch, Manchester Arndale, Birmingham Bull Ring  
- **US**: NYC Manhattan, LA Beverly Hills
- **Sweden**: Stockholm Gamla Stan, Gothenburg Center
- **Germany**: Berlin Mitte, Munich Marienplatz

### Employees (50+ team members)
- **Store Managers**: 12 (one per store)
- **Assistant Managers**: 8
- **Shift Leaders**: 10
- **Baristas**: 25+

### Performance Data
- **Revenue metrics** per store
- **Performance scores** for stores and employees
- **Country-wise analytics**
- **Trend data** and projections

## 🚀 Production Considerations

### Scalability
- **Modular backend** architecture for microservices migration
- **Database indexing** for large datasets
- **Caching strategies** for frequently accessed data
- **API rate limiting** and security

### Security
- **SSL/TLS** encrypted connections
- **Environment variables** for sensitive data
- **Input validation** and sanitization
- **CORS protection** configured

### Monitoring
- **Error tracking** and logging
- **Performance monitoring** capabilities
- **Health checks** for services
- **Analytics tracking** for usage insights

## 👨‍💼 Interview Highlights

This project demonstrates:

### Technical Leadership (20%)
- **Code architecture** and organization
- **Best practices** implementation  
- **Documentation** and knowledge sharing
- **Scalable design** decisions

### Development Skills (80%)
- **Full-stack development** proficiency
- **Modern JavaScript/TypeScript** expertise
- **Database design** and optimization
- **GraphQL** implementation
- **Responsive frontend** development

### Business Understanding
- **Domain expertise** in retail/restaurant operations
- **Multi-country** business considerations
- **Performance metrics** that matter
- **User experience** for daily operations

---

**Built with ❤️ for Joe & The Juice** 🍊

*This project showcases production-ready code suitable for a growing international brand with 400+ locations and ambitious expansion plans.* 