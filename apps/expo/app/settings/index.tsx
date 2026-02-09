import { useRef } from 'react';

import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  Button,
  Modal,
  NavButton,
  Pressable,
  Text,
  View,
  useModal,
} from '@src/components/ui';
import { ENV } from '@src/lib';
import { showAlert } from '@src/lib/alert';
import { userAPI } from '@src/lib/api/user';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout, deleteAccount, name, email } = useAuth();
  const posthog = usePostHog();

  const feedbackRef = useRef<string>('');
  const inputRef = useRef(null);

  const { ref: modalRef, present, dismiss } = useModal();

  const handleDismiss = () => {
    dismiss();
    feedbackRef.current = '';
    inputRef.current?.clear();
  };

  const feedbackMutation = useMutation({
    mutationFn: userAPI.sendFeedback,
    onError: (error) => {
      console.error('Failed to send feedback', error);
    },
    onSettled: () => {
      handleDismiss();
    },
  });

  const handleSendFeedback = (feedback: string) => {
    feedbackMutation.mutate(feedback);
  };

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
        <Text preset="heading" bold>{t('common.settings.title')}</Text>
      </View>
      <View className="mt-4 flex flex-col gap-6">
        {/* 사용자 정보 */}
        <View className="mt-4 gap-2 overflow-hidden">
          {/* 이름 행 */}
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

          {/* 이메일 행 */}
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

        {/* 언어 설정 + 진동 */}
        <View className="gap-6 overflow-hidden rounded-2xl border border-gray-300 bg-white/20 p-5">
          <Pressable
            onPress={() => router.push(ROUTES.SETTINGS.LANGUAGE)}
            className="flex flex-row items-center justify-between"
          >
            <View className="flex flex-row items-center">
              <Text preset="body">
                {t('common.settings.language')}
              </Text>
            </View>
            <NavButton
              variant="right"
              size="small"
            />
          </Pressable>
          <Pressable
            onPress={() => router.push(ROUTES.SETTINGS.VIBRATION)}
            className="flex flex-row items-center justify-between"
          >
            <Text preset="body">
              {t('common.settings.vibration')}
            </Text>
            <NavButton
              variant="right"
              size="small"
            />
          </Pressable>
        </View>

        {/* 개인정보 + 이용약관 + 앱 버전 */}
        <View className="gap-6 overflow-hidden rounded-2xl border border-gray-300 bg-white/20 p-5">
          <Pressable
            onPress={() => present()}
            className="flex flex-row items-center justify-between"
          >
            <Text preset="body">
              {t('common.settings.feedback.title')}
            </Text>
            <NavButton
              variant="right"
              size="small"
            />
          </Pressable>
          <Pressable
            onPress={() => router.push(ROUTES.SETTINGS.PRIVACY_POLICY)}
            className="flex flex-row items-center justify-between"
          >
            <Text preset="body">
              {t('common.settings.privacyPolicy')}
            </Text>
            <NavButton
              variant="right"
              size="small"
            />
          </Pressable>
          <Pressable
            onPress={() => router.push(ROUTES.SETTINGS.TERMS_OF_SERVICE)}
            className="flex flex-row items-center justify-between"
          >
            <Text preset="body">
              {t('common.settings.termsOfService')}
            </Text>
            <NavButton
              variant="right"
              size="small"
            />
          </Pressable>
          <Pressable
            onPress={() => router.push(ROUTES.SETTINGS.LICENSE_INFO)}
            className="flex flex-row items-center justify-between"
          >
            <View className="flex flex-row items-center gap-2">
              <Text preset="body">
                {t('common.settings.appVersion')} {ENV.VERSION}
              </Text>
              <Text
                preset="body"
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
      <Modal ref={modalRef}>
        <Pressable
          onPress={() => Keyboard.dismiss()}
          className="flex w-full flex-1 flex-col gap-4 px-6"
        >
          <Text preset="body">
            {t('common.settings.feedback.description')}
          </Text>
          <View className="flex flex-col gap-3">
            <BottomSheetTextInput
              placeholder={t('common.settings.feedback.placeholder')}
              className="h-48 rounded-xl border border-gray-300 bg-white/20 px-4"
              ref={inputRef}
              multiline={true}
              textAlignVertical="top"
              autoCorrect={false}
              onChangeText={(text) => (feedbackRef.current = text)}
            />
            <Button
              text={t('common.settings.feedback.send')}
              onPress={() => handleSendFeedback(feedbackRef.current)}
              className="rounded-xl bg-btn-act-page"
            />
          </View>
        </Pressable>
      </Modal>
    </PageSafeAreaView>
  );
}
