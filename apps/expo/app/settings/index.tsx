import { useState } from 'react';

import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
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
import { API_KEY } from '@src/lib/api';
import { userAPI } from '@src/lib/api/user';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { logout } = useAuth();

  const [feedback, setFeedback] = useState('');

  const { ref: modalRef, present, dismiss } = useModal();

  const handleDismiss = () => {
    dismiss();
    setFeedback('');
  };

  const { data: user } = useQuery({
    queryKey: [API_KEY.USER],
    queryFn: () => userAPI.getUser(),
  });

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

  const handleLogout = async () => {
    await logout();
    router.replace(ROUTES.LOGIN);
  };

  return (
    <PageSafeAreaView className="mt-4 gap-4 bg-page px-8">
      <View className="flex flex-row items-center justify-between gap-2">
        <NavButton
          variant="back"
          size="large"
          onPress={() => router.back()}
        />
        <Text className="text-body-large">{t('common.settings.title')}</Text>
        <View className="w-6" />
      </View>
      <View className="mt-4 flex flex-col gap-6">
        {/* 사용자 정보 */}
        <View className="mt-4 gap-2 overflow-hidden">
          {/* 이름 행 */}
          <View className="flex flex-row items-center justify-between gap-4">
            <Text className="shrink-0 text-label-medium font-medium">
              {t('common.settings.user.name')}
            </Text>
            <Text
              numberOfLines={1}
              className="flex-1 text-right text-label-medium font-medium"
            >
              {user?.name}
            </Text>
          </View>

          {/* 이메일 행 */}
          <View className="flex flex-row items-center justify-between gap-4">
            <Text className="shrink-0 text-label-medium font-medium">
              {t('common.settings.user.email')}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="flex-1 text-right text-label-medium font-medium"
            >
              {user?.email}
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
              <Text className="text-label-medium font-medium">
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
            <Text className="text-label-medium font-medium">
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
            <Text className="text-label-medium font-medium">
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
            <Text className="text-label-medium font-medium">
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
            <Text className="text-label-medium font-medium">
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
              <Text className="text-label-medium font-medium">
                {t('common.settings.appVersion')} {ENV.VERSION}
              </Text>
              <Text className="text-label-medium font-medium text-sub">
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
      <View className="mt-12 flex flex-row items-center justify-center">
        <Pressable onPress={handleLogout}>
          <Text className="text-label-medium font-medium text-destructive">
            {t('common.settings.logout')}
          </Text>
        </Pressable>
      </View>
      <Modal ref={modalRef}>
        <Pressable
          onPress={() => Keyboard.dismiss()}
          className="flex w-full flex-1 flex-col gap-4 px-6"
        >
          <Text className="text-body-small">
            {t('common.settings.feedback.description')}
          </Text>
          <View className="flex flex-col gap-4">
            <BottomSheetTextInput
              placeholder={t('common.settings.feedback.placeholder')}
              className="h-48 rounded-xl border border-gray-300 bg-white/20 px-4 text-body-medium"
              value={feedback}
              onChangeText={setFeedback}
              multiline={true}
              textAlignVertical="top"
              autoCorrect={false}
            />
            <Button
              text={t('common.settings.feedback.send')}
              onPress={() => handleSendFeedback(feedback)}
              className="rounded-xl bg-btn-act-page"
            />
          </View>
        </Pressable>
      </Modal>
    </PageSafeAreaView>
  );
}
