
# Database Schema for Haha Play Gaming Platform

## Core Tables Needed

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_tokens_earned DECIMAL(18, 8) DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);
```

### 2. Games Table
```sql
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')),
  token_reward_base DECIMAL(10, 8) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Game Sessions Table
```sql
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  tokens_earned DECIMAL(10, 8) DEFAULT 0,
  duration_seconds INTEGER,
  session_data JSONB, -- Store game-specific data
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. User Statistics Table
```sql
CREATE TABLE user_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  total_games_played INTEGER DEFAULT 0,
  total_tokens_earned DECIMAL(18, 8) DEFAULT 0,
  daily_streak INTEGER DEFAULT 0,
  last_play_date DATE,
  highest_scores JSONB DEFAULT '{}', -- {game_id: highest_score}
  achievements JSONB DEFAULT '[]', -- Array of achievement IDs
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Quests Table
```sql
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  quest_type TEXT NOT NULL, -- 'daily', 'weekly', 'achievement'
  requirements JSONB NOT NULL, -- {type: 'play_games', count: 5, game_id?: 'specific-game'}
  token_reward DECIMAL(10, 8) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. User Quest Progress Table
```sql
CREATE TABLE user_quest_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  progress JSONB DEFAULT '{}', -- Track progress details
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  tokens_claimed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);
```

### 7. Daily Challenges Table
```sql
CREATE TABLE daily_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_date DATE NOT NULL UNIQUE,
  game_id UUID REFERENCES games(id),
  challenge_type TEXT NOT NULL, -- 'high_score', 'survival', 'time_trial'
  target_value INTEGER NOT NULL, -- Score target, time limit, etc.
  token_reward DECIMAL(10, 8) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. User Challenge Attempts Table
```sql
CREATE TABLE user_challenge_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
  best_score INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  tokens_earned DECIMAL(10, 8) DEFAULT 0,
  attempt_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);
```

### 9. Leaderboards Table
```sql
CREATE TABLE leaderboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  rank INTEGER,
  period TEXT DEFAULT 'all_time', -- 'daily', 'weekly', 'monthly', 'all_time'
  period_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10. Token Transactions Table
```sql
CREATE TABLE token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'earned', 'spent', 'bonus'
  amount DECIMAL(18, 8) NOT NULL,
  source_type TEXT NOT NULL, -- 'game_completion', 'quest_reward', 'daily_challenge'
  source_id UUID, -- Reference to game_session, quest, or challenge
  description TEXT,
  wallet_transaction_hash TEXT, -- Blockchain transaction hash when tokens are withdrawn
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Implementation Steps

### Phase 1: Basic Setup
1. Set up Supabase project
2. Create users and games tables
3. Implement wallet connection
4. Basic game session tracking

### Phase 2: Game Integration
1. Create game_sessions table
2. Implement score tracking for each game
3. Add user_statistics table
4. Create leaderboards

### Phase 3: Quest System
1. Create quests and user_quest_progress tables
2. Implement quest tracking logic
3. Add daily challenges system
4. Create token rewards system

### Phase 4: Advanced Features
1. Add token_transactions table
2. Implement blockchain integration
3. Add achievement system
4. Create analytics and reporting

## Row Level Security (RLS) Policies

```sql
-- Users can only see and modify their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Game sessions are user-specific
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sessions" ON game_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON game_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Similar policies for other user-specific tables...
```

## Indexes for Performance

```sql
-- User lookups
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_users_username ON users(username);

-- Game session queries
CREATE INDEX idx_game_sessions_user_game ON game_sessions(user_id, game_id);
CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at DESC);

-- Leaderboard queries
CREATE INDEX idx_leaderboards_game_score ON leaderboards(game_id, score DESC);
CREATE INDEX idx_leaderboards_period ON leaderboards(period, period_date);

-- Quest progress
CREATE INDEX idx_user_quest_progress_user ON user_quest_progress(user_id);
CREATE INDEX idx_user_quest_progress_quest ON user_quest_progress(quest_id);
```

This schema provides a comprehensive foundation for your gaming platform with proper relationships, security, and performance considerations.
