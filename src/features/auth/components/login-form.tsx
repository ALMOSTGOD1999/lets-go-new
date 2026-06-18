import { useNavigate } from '@tanstack/react-router';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '#/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field';
import { Input } from '#/components/ui/input';
import { Spinner } from '#/components/ui/spinner';
import { authClient } from '#/lib/auth-client';
import { PasswordInput } from './password-input';

export function LoginForm() {
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    setIsPending(true);

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
    });

    setIsPending(false);

    if (signInError) {
      toast.error('Sign in failed', {
        description: signInError.message || 'Unable to sign in.',
      });
      return;
    }

    await navigate({ to: '/' });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1>Welcome back</h1>
        </CardTitle>
        <CardDescription>Sign in with your email and password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                aria-label="Email address"
                placeholder="you@example.com"
                required
                disabled={isPending}
                className="h-10"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="current-password"
                aria-label="Password"
                required
                disabled={isPending}
                className="h-10"
              />
              <FieldDescription>
                Use the password associated with your account.
              </FieldDescription>
            </Field>

            <Field>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? <Spinner data-icon="inline-start" /> : null}
                {isPending ? 'Signing in...' : 'Sign in'}
              </Button>
              <FieldError />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
