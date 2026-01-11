import { useState } from 'react';

import { Feather } from '@expo/vector-icons';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Keyboard } from 'react-native';
import { scale } from 'react-native-size-matters';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  Button,
  Modal,
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
      <Pressable
        className="flex flex-row items-center justify-between gap-2"
        onPress={() => router.back()}
      >
        <Feather
          name="arrow-left"
          size={scale(24)}
          color="black"
        />
        <Text className="text-body-large">설정</Text>
        <Feather
          name="arrow-left"
          size={scale(24)}
          color="transparent"
        />
      </Pressable>
      <View className="mt-4 flex flex-col gap-6">
        {/* 사용자 정보 */}
        <View className="mt-4 gap-2 overflow-hidden">
          {/* 이름 행 */}
          <View className="flex flex-row items-center justify-between gap-4">
            <Text className="shrink-0 text-label-medium font-medium">이름</Text>
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
              이메일
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
            className="flex flex-row items-center"
          >
            <Text className="text-label-medium font-medium">언어 설정</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push(ROUTES.SETTINGS.VIBRATION)}
            className="flex flex-row items-center"
          >
            <Text className="text-label-medium font-medium">진동</Text>
          </Pressable>
        </View>

        {/* 개인정보 + 이용약관 + 앱 버전 */}
        <View className="gap-6 overflow-hidden rounded-2xl border border-gray-300 bg-white/20 p-5">
          <Pressable
            onPress={() => present()}
            className="flex flex-row items-center"
          >
            <Text className="text-label-medium font-medium">피드백</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push(ROUTES.SETTINGS.PRIVACY_POLICY)}
            className="flex flex-row items-center"
          >
            <Text className="text-label-medium font-medium">
              개인정보 처리 방침
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push(ROUTES.SETTINGS.TERMS_OF_SERVICE)}
            className="flex flex-row items-center"
          >
            <Text className="text-label-medium font-medium">이용약관</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push(ROUTES.SETTINGS.LICENSE_INFO)}
            className="flex flex-row items-center gap-2"
          >
            <Text className="text-label-medium font-medium">
              앱 버전 {ENV.VERSION}
            </Text>
            <Text className="text-label-medium font-medium text-sub">
              라이선스 정보
            </Text>
          </Pressable>
        </View>
      </View>
      <View className="mt-12 flex flex-row items-center justify-center">
        <Pressable onPress={handleLogout}>
          <Text className="text-label-medium font-medium text-destructive">
            로그아웃
          </Text>
        </Pressable>
      </View>
      <Modal ref={modalRef}>
        <Pressable
          onPress={() => Keyboard.dismiss()}
          className="flex w-full flex-1 flex-col gap-4 px-6"
        >
          <Text className="text-body-small">자유롭게 의견을 남겨주세요</Text>
          <View className="flex flex-col gap-2">
            <BottomSheetTextInput
              placeholder="피드백을 남겨주세요."
              className="h-48 rounded-2xl border border-gray-300 bg-white/20 px-4 text-body-medium"
              value={feedback}
              onChangeText={setFeedback}
              multiline={true}
              textAlignVertical="top"
              autoCorrect={false}
            />
            <Button
              text="피드백 보내기"
              onPress={() => handleSendFeedback(feedback)}
              className="rounded-2xl bg-btn-act-page"
            />
          </View>
        </Pressable>
      </Modal>
    </PageSafeAreaView>
  );
}
