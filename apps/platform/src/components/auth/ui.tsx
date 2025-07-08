'use client';

import { AlertCircleIcon } from 'lucide-react';
import { SafeReturn } from 'next-extra';
import { useQueryState } from 'nuqs';
import { parseAsString } from 'nuqs/server';
import React, {
  ComponentProps,
  PropsWithChildren,
  ReactNode,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';

import { AuthActionParams, AuthFormData } from '@/actions/auth';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Anchor, Small } from '@/components/ui/typography';
import {
  createRequiredContext,
  useRequiredContext,
} from '@/hooks/use-required-context';
import { StyledProps } from '@/lib/utils';

interface AuthAlertType {
  description: string;
  title: string;
  variant: ComponentProps<typeof Alert>['variant'];
}

interface AuthContextType {
  alert: AuthAlertType | null;
  clearAlert: () => void;
  setErrorAlert: (message: string) => void;
  setMessageAlert: (message: string) => void;
}

const AuthContext = createRequiredContext<AuthContextType>();

export function AuthAlert({ className }: StyledProps) {
  const { alert } = useRequiredContext(AuthContext);
  if (alert === null) {
    return null;
  }

  return (
    <Alert className={className} variant={alert.variant}>
      {alert.variant === 'destructive' && <AlertCircleIcon />}

      <AlertTitle>{alert.title}</AlertTitle>

      <AlertDescription>{alert.description}</AlertDescription>
    </Alert>
  );
}

export function AuthContextProvider({ children }: PropsWithChildren) {
  const [alert, setAlert] = useState<AuthAlertType | null>(null);

  return (
    <AuthContext.Provider
      value={{
        alert,
        clearAlert: () => {
          setAlert(null);
        },
        setErrorAlert: (message) => {
          setAlert({
            description: message,
            title: 'Authentication Error',
            variant: 'destructive',
          });
        },
        setMessageAlert: (message) => {
          setAlert({
            description: message,
            title: 'Success!',
            variant: 'default',
          });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthFooter({
  forgot,
  notice = false,
  signin,
  signup,
}: {
  readonly forgot?: string;
  readonly notice?: boolean;
  readonly signin?: string;
  readonly signup?: string;
}) {
  return (
    <div className='space-y-4'>
      {notice ? (
        <Small>
          By signing in, you are agreeing to our{' '}
          <Anchor href='https://kiltok.com/legal/terms-of-service'>
            Terms of Service
          </Anchor>{' '}
          and{' '}
          <Anchor href='https://kiltok.com/legal/privacy-policy'>
            Privacy Policy
          </Anchor>
          .
        </Small>
      ) : null}

      {signin ? (
        <Small>
          {signin} <Anchor href='/auth/login'>Sign in</Anchor>
        </Small>
      ) : null}

      {signup ? (
        <Small>
          <Anchor href='/auth/signup'>{signup}</Anchor>
        </Small>
      ) : null}

      {forgot ? (
        <Small>
          <Anchor href='/auth/forgot-password'>{forgot}</Anchor>
        </Small>
      ) : null}
    </div>
  );
}

export function AuthForm({
  confirmPassword = false,
  email = false,
  password = false,
  submitAction,
  submitText,
}: {
  readonly confirmPassword?: boolean;
  readonly email?: boolean;
  readonly password?: boolean;
  readonly submitAction: (
    args: AuthActionParams
  ) => Promise<SafeReturn<{ message: string }>>;
  readonly submitText: string;
}) {
  const { clearAlert, setErrorAlert, setMessageAlert } =
    useRequiredContext(AuthContext);

  const context = useForm<AuthFormData>({
    defaultValues: {
      confirmPassword: '',
      email: '',
      password: '',
    },
  });

  const [afterAuthPath, _] = useQueryState(
    'next',
    parseAsString.withDefault('/')
  );

  const onSubmit = async (formData: AuthFormData) => {
    clearAlert();
    const { data, error } = await submitAction({ ...formData, afterAuthPath });
    if (error === undefined) {
      setMessageAlert(data.message);
    } else {
      setErrorAlert(error.message);
    }
  };

  const {
    formState: { isSubmitting },
    getValues,
    handleSubmit,
  } = context;

  return (
    <Form {...context}>
      <form className='space-y-4' noValidate onSubmit={handleSubmit(onSubmit)}>
        {email ? (
          <FormField
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>

                <FormControl>
                  <Input type='email' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
            rules={{
              pattern: {
                message: 'Please enter a valid email address',
                value: /^[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/,
              },
              required: 'Please enter your email',
            }}
          />
        ) : null}

        {password ? (
          <FormField
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>

                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
            rules={{
              minLength: {
                message: 'Password must be at least 8 characters long',
                value: confirmPassword ? 8 : -1,
              },
              required: 'Please enter a password',
            }}
          />
        ) : null}

        {confirmPassword ? (
          <FormField
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>

                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
            rules={{
              required: 'Please enter your password again',
              validate: (value) =>
                value === getValues().password || 'Passwords do not match',
            }}
          />
        ) : null}

        <Button className='w-full' loading={isSubmitting} type='submit'>
          {submitText}
        </Button>
      </form>
    </Form>
  );
}

export function AuthSocialButton({
  icon,
  id: _provider,
  name,
}: {
  readonly icon: ReactNode;
  readonly id: string;
  readonly name: string;
}) {
  const [pending, setPending] = useState<boolean>(false);
  return (
    <Button
      className='w-full'
      loading={pending}
      onClick={() => {
        setPending(true);
        // TODO
      }}
      variant='outline'
    >
      {icon}

      {name}
    </Button>
  );
}
