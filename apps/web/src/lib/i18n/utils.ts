import { cookies } from 'next/headers';

import { initI18n } from '@pado/i18n';

const getInitialLanguage = async () => {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'en';

  return lang;
};

export const i18n = initI18n(await getInitialLanguage());
