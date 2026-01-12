import { storage } from './store';

const ONBOARD_STATUS_KEY = 'onboard_status';

export const isOnboarded = () => {
  const status = storage.getBoolean(ONBOARD_STATUS_KEY);
  if (status === undefined) {
    setIsOnboarded(false);
    return false;
  }
  return status;
};

export const setIsOnboarded = (status: boolean) => {
  storage.set(ONBOARD_STATUS_KEY, status);
};
