-- =============================================
-- Bible Together: 전체 데이터베이스 셋업
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- 0. uuid-ossp 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. profiles 테이블 생성
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE,
    name text NOT NULL,
    phone text,
    role text DEFAULT 'MEMBER' CHECK (role IN ('MEMBER', 'LEADER', 'PASTOR')),
    avatar_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 2. cells 테이블 생성
CREATE TABLE IF NOT EXISTS cells (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    invite_code text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. cell_members 테이블 생성
CREATE TABLE IF NOT EXISTS cell_members (
    cell_id uuid REFERENCES cells(id) ON DELETE CASCADE,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (cell_id, user_id)
);

-- 4. reading_activities 테이블 생성
CREATE TABLE IF NOT EXISTS reading_activities (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    cell_id uuid,
    user_id uuid,
    user_name text,
    book text NOT NULL,
    chapter integer NOT NULL,
    verse integer NOT NULL,
    translation text DEFAULT 'KRV',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 5. notifications 테이블 생성
CREATE TABLE IF NOT EXISTS notifications (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    body text NOT NULL,
    target text DEFAULT 'ALL' CHECK (target IN ('ALL', 'LEADER', 'CELL')),
    created_by uuid,
    cell_id uuid,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 6. notification_reads 테이블 생성
CREATE TABLE IF NOT EXISTS notification_reads (
    notification_id uuid REFERENCES notifications(id) ON DELETE CASCADE,
    user_id uuid,
    read_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (notification_id, user_id)
);

-- 7. RLS 비활성화 (개발용)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE cells DISABLE ROW LEVEL SECURITY;
ALTER TABLE cell_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE reading_activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_reads DISABLE ROW LEVEL SECURITY;

-- 8. 기본 교구 데이터 삽입
INSERT INTO cells (id, name, invite_code) VALUES
  (uuid_generate_v4(), '믿음 교구', 'FAITH'),
  (uuid_generate_v4(), '소망 교구', 'HOPE'),
  (uuid_generate_v4(), '사랑 교구', 'LOVE')
ON CONFLICT (invite_code) DO NOTHING;

-- 9. 확인
SELECT * FROM cells;
SELECT * FROM profiles;
