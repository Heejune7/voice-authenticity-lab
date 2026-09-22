# Voice Authenticity Lab

44.1 kHz로 통일된 음성 샘플을 듣고 Real voice / Deepfake를 분류하는 실험 웹앱입니다.

## Run locally
```bash
npm install
copy .env.example .env.local
npm run dev
```
Supabase 환경변수가 없으면 `public/audio`의 두 샘플로 로컬 미리보기가 실행됩니다.

## Supabase setup
1. Supabase SQL Editor에서 `supabase/schema.sql` 실행
2. `audio` bucket을 확인
3. Supabase URL과 service role key를 환경변수로 넣고 `npm run upload:audio` 실행
4. `supabase/functions/submit-trial`을 배포하고 `supabase functions deploy submit-trial --no-verify-jwt` 실행
5. `.env.local`에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 입력

정답(`ground_truth`)은 브라우저 조회 대상에서 제외되고 Edge Function이 서버에서 채점합니다. 실제 운영에서는 storage bucket을 private으로 바꾸고 signed URL 발급 함수로 전환하세요.
