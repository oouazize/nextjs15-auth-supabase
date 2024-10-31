import { createContext } from 'react';
import UserData from '../types/user-data';

const UserSessionContext = createContext<{
  userSession: Maybe<UserData>;
  setUserSession: React.Dispatch<React.SetStateAction<Maybe<UserData>>>;
}>({
  userSession: undefined,
  setUserSession: (_) => _,
});

export default UserSessionContext;
