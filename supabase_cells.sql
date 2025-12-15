-- =============================================
-- Bible Together: 교구(셀) 데이터 추가
-- Supabase SQL Editor에서 실행
-- =============================================

-- 1. 기존 테스트 데이터 삭제 (선택사항)
-- DELETE FROM cells WHERE invite_code IN ('YOUTH', 'WORKER', 'NEWLYWED');

-- 2. 교구 데이터 추가
INSERT INTO cells (id, name, invite_code) VALUES
  (uuid_generate_v4(), '믿음 교구', 'FAITH'),
  (uuid_generate_v4(), '소망 교구', 'HOPE'),
  (uuid_generate_v4(), '레브 교구', 'LOVE')
ON CONFLICT (invite_code) DO NOTHING;

-- 3. 확인
SELECT * FROM cells;
