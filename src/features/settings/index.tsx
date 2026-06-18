import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import { LogOutIcon, SaveIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Main } from '#/components/layout/main';
import { Button } from '#/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field';
import { Input } from '#/components/ui/input';
import { authClient } from '#/lib/auth-client';

type SettingsPageProps = {
  user: {
    name: string;
    email: string;
  };
};

export function SettingsPage({ user }: SettingsPageProps) {
  const navigate = useNavigate();
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const profileForm = useForm({
    defaultValues: {
      name: user.name,
    },
    onSubmit: async ({ value }) => {
      setProfileSubmitting(true);
      try {
        await authClient.updateUser({ name: value.name });
        toast.success('Profile updated');
      } catch (error) {
        toast.error('Unable to update profile', {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      } finally {
        setProfileSubmitting(false);
      }
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      if (value.newPassword !== value.confirmPassword) {
        setPasswordError('Passwords do not match');
        return;
      }
      setPasswordError(null);
      setPasswordSubmitting(true);
      try {
        await authClient.changePassword({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        });
        toast.success('Password changed');
        passwordForm.reset();
      } catch (error) {
        setPasswordError(
          error instanceof Error ? error.message : 'Failed to change password',
        );
      } finally {
        setPasswordSubmitting(false);
      }
    },
  });

  const signOut = async () => {
    await authClient.signOut();
    await navigate({ to: '/login' });
  };

  return (
    <Main>
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-4xl">Settings</h1>
          <p className="text-muted-foreground">
            Manage account and application settings here.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your name and email address.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void profileForm.handleSubmit();
              }}
            >
              <FieldGroup>
                <profileForm.Field name="name">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                    </Field>
                  )}
                </profileForm.Field>
              </FieldGroup>
              <div className="mt-4">
                <Button type="submit" disabled={profileSubmitting}>
                  <SaveIcon data-icon="inline-start" />
                  {profileSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void passwordForm.handleSubmit();
              }}
            >
              <FieldGroup>
                <passwordForm.Field name="currentPassword">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Current password
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                    </Field>
                  )}
                </passwordForm.Field>
                <passwordForm.Field name="newPassword">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>New password</FieldLabel>
                      <Input
                        id={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                    </Field>
                  )}
                </passwordForm.Field>
                <passwordForm.Field name="confirmPassword">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Confirm new password
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                      />
                    </Field>
                  )}
                </passwordForm.Field>
              </FieldGroup>
              {passwordError && (
                <p className="mt-2 text-sm text-destructive">{passwordError}</p>
              )}
              <div className="mt-4">
                <Button type="submit" disabled={passwordSubmitting}>
                  <SaveIcon data-icon="inline-start" />
                  {passwordSubmitting ? 'Changing...' : 'Change password'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="md:hidden">
          <Button
            onClick={() => {
              void signOut();
            }}
            type="button"
            variant="outline"
          >
            <LogOutIcon data-icon="inline-start" />
            Sign out
          </Button>
        </div>
      </div>
    </Main>
  );
}
