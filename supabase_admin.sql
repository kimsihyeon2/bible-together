-- =============================================
-- Bible Together: 관리자 계정 생성
-- Supabase SQL Editor에서 실행
-- =============================================

-- 관리자가 회원가입한 후 이 SQL로 역할을 PASTOR로 변경
-- 관리자 이메일: church.admin@example.com (예시)

-- 1. 관리자 역할 업그레이드 (이메일로 찾기)
-- 실제 관리자 이메일로 변경하세요!
UPDATE profiles
SET role = 'PASTOR'
WHERE email = 'church.admin@example.com';

-- 또는 특정 사용자 ID로
-- UPDATE profiles SET role = 'PASTOR' WHERE id = '[user-uuid]';

-- 2. 확인
SELECT id, email, name, role FROM profiles WHERE role = 'PASTOR';
