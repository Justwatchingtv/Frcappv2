# Options Flow - Social Trading Platform

A cutting-edge social trading platform that revolutionizes financial market engagement through technology-driven insights and community collaboration.

## Features

### 1. User Authentication & Profile Management
- Secure user registration and login
- Customizable user profiles with:
  - Trading style preferences (day trader, swing trader, position trader, scalper)
  - Risk tolerance settings
  - Experience level indicators
  - Profile picture upload
  - Bio and personal information
  - Trading goals and targets

### 2. Social Feed
- Real-time trading insights and analysis sharing
- Post filtering by categories:
  - Following
  - Watchlist
  - Trending
  - Personalized recommendations
- Support for ticker mentions using $symbol format
- Interactive post engagement

### 3. Options Flow Analysis
- Real-time options flow data visualization
- Large options trade monitoring
- Unusual options activity detection
- Historical options data analysis
- Integration with Polygon.io for market data

### 4. Paper Trading Simulator
- Virtual trading environment with $100,000 starting balance
- Real-time market data integration
- Support for various order types
- Position tracking and management
- P&L monitoring
- Risk management tools

### 5. Trading Challenges
- Create and participate in trading competitions
- Customizable challenge parameters:
  - Initial balance
  - Duration
  - Allowed instruments
  - Maximum leverage
- Real-time leaderboard
- Achievement system

### 6. Market Analysis Tools
- Technical analysis indicators
- Market sentiment analysis
- Trending stocks identification
- Real-time market data
- News integration

### 7. Achievement System
- Performance-based badges
- Trading milestones tracking
- Skill level progression
- Community recognition

## Tech Stack

### Frontend
- React with TypeScript
- TanStack Query for data fetching
- Shadcn UI components
- Tailwind CSS for styling
- Wouter for routing
- Framer Motion for animations

### Backend
- Node.js with Express
- PostgreSQL database
- Drizzle ORM
- Passport.js for authentication
- WebSocket integration for real-time updates

### External Integrations
- Polygon.io API for market data
- TradingView widgets for charts
- Real-time market data feeds

## Database Schema

The application uses a comprehensive PostgreSQL database with the following main entities:

- Users: Profile and authentication information
- Posts: Social feed content
- Options Flow: Market data tracking
- Trading Challenges: Competition management
- Paper Trading: Virtual trading accounts and positions
- Achievements: User accomplishments and badges

## Getting Started

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- Polygon.io API key

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
DATABASE_URL=your_postgres_url
POLYGON_API_KEY=your_api_key
```

4. Initialize the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

## Code Structure

```
├── client/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   └── lib/          # Utility functions
├── db/
│   ├── schema.ts         # Database schema definitions
│   └── index.ts          # Database connection setup
├── server/
│   ├── auth.ts           # Authentication logic
│   ├── routes.ts         # API routes
│   └── index.ts          # Server setup
```

## API Routes

### Authentication
- POST /api/register - User registration
- POST /api/login - User login
- POST /api/logout - User logout
- GET /api/user - Get current user

### Social Features
- GET /api/posts - Get social feed posts
- POST /api/posts - Create new post
- GET /api/user/achievements - Get user achievements

### Trading
- GET /api/options-flow - Get options flow data
- GET /api/paper-trading - Get paper trading account
- POST /api/paper-trading/positions - Create new position

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
