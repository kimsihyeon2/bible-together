-- notifications 테이블 생성
CREATE TABLE IF NOT EXISTS notifications (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    body text NOT NULL,
    target text DEFAULT 'ALL' CHECK (target IN ('ALL', 'LEADER', 'CELL')),
    created_by uuid, -- 알림 보낸 사람
    cell_id uuid, -- 특정 셀에만 보내는 경우
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- reading_activities FK 제약 제거 (데모 유저 호환)
ALTER TABLE reading_activities DROP CONSTRAINT IF EXISTS reading_activities_user_id_fkey;
ALTER TABLE reading_activities DROP CONSTRAINT IF EXISTS reading_activities_cell_id_fkey;

-- notification_reads 테이블 (읽음 표시용)
CREATE TABLE IF NOT EXISTS notification_reads (
    notification_id uuid REFERENCES notifications(id) ON DELETE CASCADE,
    user_id uuid,
    read_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (notification_id, user_id)
);

-- RLS 비활성화
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_reads DISABLE ROW LEVEL SECURITY;
