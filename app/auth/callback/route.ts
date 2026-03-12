import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    
    // Exchange the auth code for a session
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && session) {
      // -------------------------------------------------------------
      // 사용자 정보를 DB (public.users) 에 저장하거나 업데이트하는 로직
      // Google에서 제공하는 이름(full_name)이나 이메일(email)과 같은 메타데이터를 저장할 수 있습니다.
      // -------------------------------------------------------------
      const user = session.user;
      console.log('--- OAuth Callback Debug ---');
      console.log('User ID:', user.id);
      console.log('User Email:', user.email);
      console.log('User Metadata:', user.user_metadata);
      
      // auth.users 외에 우리가 직접 관리할 수 있는 public.users 테이블에 사용자 정보를 저장 (upsert)
      const { data: upsertData, error: insertError } = await supabase
        .from('users') // 주의: Supabase에 'users' 테이블이 public 스키마에 생성되어 있어야 합니다.
        .upsert({
          id: user.id, // auth.users 테이블의 id와 동일
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          updated_at: new Date().toISOString()
        })
        .select();

      if (insertError) {
        console.error("Failed to insert/update user to public.users table:");
        console.error("Error Detail:", JSON.stringify(insertError, null, 2));
      } else {
        console.log("Successfully upserted user:", upsertData);
      }

      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // 오류 시 리다이렉트 (로그인 페이지로 돌려보내기)
  return NextResponse.redirect(`${origin}/auth`)
}
