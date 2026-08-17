-- supabase/schema.sql

CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    total_courts INTEGER NOT NULL CHECK (total_courts > 0),
    status TEXT NOT NULL CHECK (status IN ('draft', 'in_progress', 'completed')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL CHECK (round_number > 0),
    court_number INTEGER NOT NULL CHECK (court_number > 0),
    team_1_p1_id UUID REFERENCES players(id),
    team_1_p2_id UUID REFERENCES players(id),
    team_2_p1_id UUID REFERENCES players(id),
    team_2_p2_id UUID REFERENCES players(id),
    score_team_1 INTEGER,
    score_team_2 INTEGER,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- View to calculate standings on the fly from the database if needed (Historical reference)
CREATE OR REPLACE VIEW tournament_standings AS
SELECT 
    p.tournament_id,
    p.id as player_id,
    p.name as player_name,
    COALESCE(SUM(
        CASE 
            WHEN m.team_1_p1_id = p.id OR m.team_1_p2_id = p.id THEN m.score_team_1
            WHEN m.team_2_p1_id = p.id OR m.team_2_p2_id = p.id THEN m.score_team_2
            ELSE 0
        END
    ), 0) as points_for,
    COALESCE(SUM(
        CASE 
            WHEN m.team_1_p1_id = p.id OR m.team_1_p2_id = p.id THEN m.score_team_2
            WHEN m.team_2_p1_id = p.id OR m.team_2_p2_id = p.id THEN m.score_team_1
            ELSE 0
        END
    ), 0) as points_against,
    COUNT(m.id) as matches_played
FROM players p
LEFT JOIN matches m ON 
    (p.id IN (m.team_1_p1_id, m.team_1_p2_id, m.team_2_p1_id, m.team_2_p2_id))
    AND m.status = 'completed'
GROUP BY p.tournament_id, p.id, p.name;

-- Disable Row Level Security (RLS) to allow public inserts from the frontend
ALTER TABLE tournaments DISABLE ROW LEVEL SECURITY;
ALTER TABLE players DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
