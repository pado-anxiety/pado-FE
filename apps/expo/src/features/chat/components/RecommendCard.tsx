import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { Text, View } from '@src/components/ui';
import { ActRecommendResponse, RecommendACTType } from '@src/lib/api';
import { ROUTES } from '@src/lib/route';

const ACT_LABEL: Record<RecommendACTType, string> = {
  CONTACT_WITH_PRESENT: '현재와의 접촉',
  EMOTION_NOTE: '감정 일기',
  COGNITIVE_DEFUSION: '인지적 탈융합',
  ACCEPTANCE: '수용',
  COMMITTED_ACTION: '전념 행동',
};

const ACT_ROUTE: Record<RecommendACTType, string> = {
  CONTACT_WITH_PRESENT: ROUTES.ACT.ANCHOR.BASE,
  EMOTION_NOTE: ROUTES.ACT.DIARY.BASE,
  COGNITIVE_DEFUSION: ROUTES.ACT.DETACH.BASE,
  ACCEPTANCE: ROUTES.ACT.EMBRACE.BASE,
  COMMITTED_ACTION: ROUTES.ACT.ACTION.BASE,
};

interface RecommendCardProps {
  isVisible: boolean;
  isLoading: boolean;
  data: ActRecommendResponse | null;
  onDismiss: () => void;
}

export function RecommendCard({
  isVisible,
  isLoading,
  data,
  onDismiss,
}: RecommendCardProps) {
  if (!isVisible) return null;

  const handleNavigate = () => {
    if (!data) return;
    onDismiss();
    router.push(ACT_ROUTE[data.act] as never);
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(250)}
      exiting={FadeOutDown.duration(200)}
      style={{
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(20, 25, 40, 0.95)',
        padding: 20,
      }}
    >
      {isLoading ? (
        <View className="items-center py-6">
          <ActivityIndicator
            size="small"
            color="#FFFFFF"
          />
        </View>
      ) : data ? (
        <>
          <View className="mb-3 flex-row items-start justify-between">
            <View className="flex-1 gap-1">
              <Text
                preset="caption"
                className="text-white/50"
              >
                추천 활동
              </Text>
              <Text
                preset="heading"
                bold
                className="text-white"
              >
                {ACT_LABEL[data.act]}
              </Text>
            </View>
            <Pressable
              onPress={onDismiss}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons
                name="close"
                size={20}
                color="rgba(255, 255, 255, 0.5)"
              />
            </Pressable>
          </View>
          <View className="mb-4 gap-2">
            {data.reasons.map((reason, index) => (
              <Text
                key={index}
                preset="sub"
                className="text-white/70"
              >
                {reason}
              </Text>
            ))}
          </View>
          <Pressable
            onPress={handleNavigate}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 14,
              borderRadius: 14,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
            }}
          >
            <Text
              preset="body"
              bold
              className="text-white"
            >
              시작하기
            </Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color="#FFFFFF"
            />
          </Pressable>
        </>
      ) : null}
    </Animated.View>
  );
}
