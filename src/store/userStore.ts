import { useState } from 'react';

export const useUserStore = () => {
  const [user, setUser] = useState<any>(null);

  const setUserInfo = (userInfo: any) => {
    setUser(userInfo);
  };

  return {
    user,
    setUserInfo,
  };
};
