import React from 'react';

import {
  changePasswordAction,
  forgotPasswordAction,
  loginAction,
  signUpAction,
} from '@/actions/auth';
import {
  AuthAlert,
  AuthContextProvider,
  AuthFooter,
  AuthForm,
} from '@/components/auth/ui';
import { BrandLogo } from '@/components/brand/logo';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { H3 } from '@/components/ui/typography';

const formTypes = [
  // 'signup',
  'login',
  'forgot-password',
  'change-password',
] as const;

type FormType = (typeof formTypes)[number];

export const dynamic = 'error';
export const dynamicParams = false;

export function generateStaticParams() {
  return formTypes.map((type) => ({ type }));
}

const metadataVariants = {
  'change-password': {
    title: 'Change Password',
  },
  'forgot-password': {
    title: 'Forgot Password',
  },
  login: {
    title: 'Login',
  },
  signup: {
    title: 'Sign up',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: FormType }>;
}) {
  const { type } = await params;
  return metadataVariants[type];
}

const pageVariants = {
  'change-password': {
    footer: {
      notice: false,
    },
    form: {
      confirmPassword: true,
      password: true,
      submitAction: changePasswordAction,
      submitText: 'Change password',
    },
    title: 'Choose a new password',
  },
  'forgot-password': {
    footer: {
      notice: false,
      signin: 'Remember it after all?',
    },
    form: {
      email: true,
      submitAction: forgotPasswordAction,
      submitText: 'Reset password',
    },
    title: 'Get a new password',
  },
  login: {
    footer: {
      forgot: 'Forgot Password?',
      notice: true,
      // signup: 'Create an account',
    },
    form: {
      email: true,
      password: true,
      submitAction: loginAction,
      submitText: 'Sign in',
    },
    title: 'Sign in to iMigration Dashboard',
  },
  signup: {
    footer: {
      notice: true,
      signin: 'Already have an account?',
    },
    form: {
      confirmPassword: true,
      email: true,
      password: true,
      submitAction: signUpAction,
      submitText: 'Sign up',
    },
    title: 'Get yourself an account',
  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ type: FormType }>;
}) {
  const { type } = await params;
  const { footer, form, title } = pageVariants[type];

  return (
    <AuthContextProvider>
      <Section className='flex flex-1 flex-col justify-center'>
        <Container size='narrow'>
          <div className='mb-10 flex flex-col items-center gap-2 text-center'>
            <BrandLogo className='size-10' />

            <H3>{title}</H3>
          </div>

          <div className='space-y-4'>
            <AuthAlert />

            <AuthForm {...form} />

            <AuthFooter {...footer} />
          </div>
        </Container>
      </Section>
    </AuthContextProvider>
  );
}
