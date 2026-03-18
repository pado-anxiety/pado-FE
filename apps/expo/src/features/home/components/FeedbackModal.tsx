import { useRef } from 'react';

import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useMutation } from '@tanstack/react-query';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import { Keyboard } from 'react-native';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import {
  Button,
  Modal,
  Pressable,
  Text,
  View,
  useModal,
} from '@src/components/ui';
import { userAPI } from '@src/lib/api/user';

const INPUT_HEIGHT = 160;
const INPUT_BORDER_RADIUS = 12;
const INPUT_PADDING_HORIZONTAL = 16;
const INPUT_PADDING_TOP = 16;

export const useFeedbackModal = () => {
  const { ref, present, dismiss } = useModal();
  return { ref, present, dismiss };
};

export function FeedbackModal({
  modalRef,
  dismiss,
}: {
  modalRef: React.Ref<any>;
  dismiss: () => void;
}) {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const tokens =
    colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;

  const feedbackRef = useRef<string>('');
  const inputRef = useRef(null);

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

  return (
    <Modal
      ref={modalRef}
      backgroundStyle={{ backgroundColor: tokens['--bg-page'] }}
    >
      <Pressable
        onPress={() => Keyboard.dismiss()}
        className="flex w-full flex-1 flex-col gap-3"
      >
        <View className="gap-1">
          <Text
            preset="body"
            bold
          >
            사용하면서 느낀 점을 편하게 남겨주세요.
          </Text>
          <Text preset="body">
            피드백은 서비스를 개선하는데 큰 도움이 됩니다.
          </Text>
        </View>
        <View className="flex flex-col gap-3">
          <BottomSheetTextInput
            placeholder={t('common.settings.feedback.placeholder')}
            style={{
              backgroundColor: tokens['--bg-surface'],
              height: INPUT_HEIGHT,
              borderRadius: INPUT_BORDER_RADIUS,
              paddingHorizontal: INPUT_PADDING_HORIZONTAL,
              paddingTop: INPUT_PADDING_TOP,
            }}
            ref={inputRef}
            multiline={true}
            textAlignVertical="top"
            autoCorrect={false}
            onChangeText={(text) => (feedbackRef.current = text)}
          />
          <Button
            text={t('common.settings.feedback.send')}
            onPress={() => feedbackMutation.mutate(feedbackRef.current)}
            className="rounded-xl bg-btn-act-page"
          />
        </View>
      </Pressable>
    </Modal>
  );
}
