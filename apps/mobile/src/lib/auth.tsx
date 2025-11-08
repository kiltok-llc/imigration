import { Session } from '@supabase/auth-js';
import { atom, useSetAtom } from 'jotai';
import { useEffect } from 'react';

import { supabase } from '@/lib/supabase/client';

export const sessionAtom = atom<null | Session>(null);

export function AuthProvider() {
  const setSession = useSetAtom(sessionAtom);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        console.debug('auth session not found, signing in anonymously');
        supabase.auth
          .signInAnonymously()
          .then(({ data: { session }, error }) => {
            if (error) {
              console.error('error during anonymous sign in', error);
              return;
            }

            setSession(session);
          });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession]);

  return null;
}
