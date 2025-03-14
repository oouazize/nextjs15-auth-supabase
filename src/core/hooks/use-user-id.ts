import useUserSession from './use-user-session';

export default function useUserId() {
  const session = useUserSession();

  return session?.id;
}
