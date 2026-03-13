import { useRouter } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import { useTranslation } from 'react-i18next';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  NavButton,
  Pressable,
  Text,
  View,
} from '@src/components/ui';
import { ENV } from '@src/lib';
import { showAlert } from '@src/lib/alert';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout, deleteAccount, name, email } = useAuth();
  const posthog = usePostHog();

  const handleLogout = () => {
    showAlert.confirm(
      t('common.settings.logoutConfirmTitle'),
      t('common.settings.logoutConfirmMessage'),
      async () => {
        await logout();
        posthog.reset();
        router.replace(ROUTES.LOGIN);
      },
    );
  };

  const handleDeleteAccount = () => {
    showAlert.confirm(
      t('common.settings.deleteAccountConfirmTitle'),
      t('common.settings.deleteAccountConfirmMessage'),
      async () => {
        await deleteAccount();
        posthog.reset();
        router.replace(ROUTES.LOGIN);
      },
    );
  };

  return (
    <PageSafeAreaView className="mt-4 gap-4 bg-page px-8">
      <View className="relative flex items-center justify-between">
        <View className="absolute left-[-8px]">
          <NavButton
            variant="back"
            size="large"
            onPress={() => router.back()}
          />
        </View>
        <Text
          preset="heading"
          bold
        >
          {t('common.settings.title')}
        </Text>
      </View>
      <View className="mt-4 flex flex-col gap-6">
        {/* 사용자 정보 */}
        <View className="mt-4 gap-2 overflow-hidden">
          <View className="flex flex-row items-center justify-between gap-4">
            <Text
              preset="body"
              className="shrink-0"
            >
              {t('common.settings.user.name')}
            </Text>
            <Text
              numberOfLines={1}
              preset="body"
              className="flex-1 text-right"
            >
              {name}
            </Text>
          </View>
          <View className="flex flex-row items-center justify-between gap-4">
            <Text
              preset="body"
              className="shrink-0"
            >
              {t('common.settings.user.email')}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              preset="body"
              className="flex-1 text-right"
            >
              {email}
            </Text>
          </View>
        </View>

        {/* 앱 설정 */}
        <View className="flex-col gap-3">
          <View className="overflow-hidden rounded-2xl bg-surface p-1">
            <Pressable
              onPress={() => router.push(ROUTES.SETTINGS.THEME)}
              className="flex flex-row items-center justify-between px-5 py-4"
            >
              <Text preset="body">{t('common.settings.theme')}</Text>
              <NavButton
                variant="right"
                size="small"
              />
            </Pressable>
            <Pressable
              onPress={() => router.push(ROUTES.SETTINGS.LANGUAGE)}
              className="flex flex-row items-center justify-between px-5 py-4"
            >
              <Text preset="body">{t('common.settings.language')}</Text>
              <NavButton
                variant="right"
                size="small"
              />
            </Pressable>
            <Pressable
              onPress={() => router.push(ROUTES.SETTINGS.VIBRATION)}
              className="flex flex-row items-center justify-between px-5 py-4"
            >
              <Text preset="body">{t('common.settings.vibration')}</Text>
              <NavButton
                variant="right"
                size="small"
              />
            </Pressable>
          </View>

          {/* 정보 */}
          <View className="overflow-hidden rounded-2xl bg-surface p-1">
            <Pressable
              onPress={() => router.push(ROUTES.SETTINGS.PRIVACY_POLICY)}
              className="flex flex-row items-center justify-between px-5 py-4"
            >
              <Text preset="body">{t('common.settings.privacyPolicy')}</Text>
              <NavButton
                variant="right"
                size="small"
              />
            </Pressable>
            <Pressable
              onPress={() => router.push(ROUTES.SETTINGS.TERMS_OF_SERVICE)}
              className="flex flex-row items-center justify-between px-5 py-4"
            >
              <Text preset="body">{t('common.settings.termsOfService')}</Text>
              <NavButton
                variant="right"
                size="small"
              />
            </Pressable>
            <Pressable
              onPress={() => router.push(ROUTES.SETTINGS.LICENSE_INFO)}
              className="flex flex-row items-center justify-between px-5 py-4"
            >
              <View className="flex flex-row items-center gap-2">
                <Text preset="body">
                  {t('common.settings.appVersion')} {ENV.VERSION}
                </Text>
                <Text
                  preset="caption"
                  className="text-sub"
                >
                  {t('common.settings.licenseInfo')}
                </Text>
              </View>
              <NavButton
                variant="right"
                size="small"
              />
            </Pressable>
          </View>
        </View>
      </View>
      <View className="mt-12 flex flex-col items-center justify-center gap-8">
        <Pressable onPress={handleLogout}>
          <Text
            preset="body"
            className="text-destructive"
          >
            {t('common.settings.logout')}
          </Text>
        </Pressable>
        <Pressable onPress={handleDeleteAccount}>
          <Text
            preset="body"
            className="text-sub"
          >
            {t('common.settings.deleteAccount')}
          </Text>
        </Pressable>
      </View>
    </PageSafeAreaView>
  );
}
