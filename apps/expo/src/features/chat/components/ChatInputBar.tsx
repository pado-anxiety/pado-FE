import { Ionicons } from '@expo/vector-icons';
import { View } from '@src/components/ui';
import { ICONS_SIZE } from '@src/lib/styles';
import { Pressable } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

interface ChatInputBarProps {
  /** 현재 메시지 텍스트 */
  message: string;
  /** 메시지 변경 핸들러 */
  onMessageChange: (text: string) => void;
  /** 포커스 핸들러 */
  onFocus: () => void;
  /** 전송 핸들러 */
  onSend: () => void;
  /** TextInput ref */
  ref: React.RefObject<TextInput | null>;
  /** 채팅 모달 표시 여부 */
  isChatModalVisible: boolean;
  /** 채팅 모달 표시 설정 */
  setIsChatModalVisible: (visible: boolean) => void;
  /** CBT 추천 요청 핸들러 */
  getCBTRecommendation: () => void;
  /** CBT 추천 모달 표시 여부 */
  isRecommandationModalVisible: boolean;
}

export default function ChatInputBar({
  message,
  onMessageChange,
  onFocus,
  onSend,
  ref,
  isChatModalVisible,
  setIsChatModalVisible,
  getCBTRecommendation,
  isRecommandationModalVisible,
}: ChatInputBarProps) {
  const handlePress = async () => {
    if (isChatModalVisible) return;

    setIsChatModalVisible(!isChatModalVisible);
    await new Promise((resolve) => setTimeout(resolve, 500));
    ref?.current?.focus();
  };

  return (
    <Pressable
      className="flex flex-row items-center 
      justify-center gap-2 mt-4 border-input 
      border-neutral-700
      border-solid border rounded-full
      focus:border-neutral-600 py-1 px-1"
      style={{
        backgroundColor: 'rgba(65, 65, 65, 0.9)',
        opacity: isRecommandationModalVisible ? 0.5 : 1,
      }}
      onPress={handlePress}
      pointerEvents={
        !(isChatModalVisible && isRecommandationModalVisible) ? 'auto' : 'none'
      }
    >
      <Pressable
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        onPress={() => {
          if (!isChatModalVisible) return;

          getCBTRecommendation();
        }}
        className="bg-neutral-600 aspect-square rounded-full p-3"
      >
        <Ionicons
          name="sparkles"
          size={ICONS_SIZE.medium}
          color="rgb(238, 238, 238)"
        />
      </Pressable>
      <View
        className="flex-1 justify-center"
        pointerEvents={isChatModalVisible ? 'auto' : 'none'}
      >
        <TextInput
          ref={ref}
          className="bg-chat-input rounded-xl px-2 text-white grow focus:border-input-focus"
          style={{ fontSize: 17, height: 30 }}
          placeholder="메시지를 입력해주세요"
          placeholderTextColor="rgba(255, 255, 255, 0.50)"
          onFocus={onFocus}
          value={message}
          onChangeText={onMessageChange}
          textAlignVertical="center"
        />
      </View>
      <Pressable
        onPress={onSend}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Ionicons
          name="send"
          size={ICONS_SIZE.medium}
          color={
            message.length > 0
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(255, 255, 255, 0.5)'
          }
          className="pr-4"
        />
      </Pressable>
    </Pressable>
  );
}
