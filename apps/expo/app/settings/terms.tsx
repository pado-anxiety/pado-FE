import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';
import { scale } from 'react-native-size-matters';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { Pressable, Text, View } from '@src/components/ui';

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <PageSafeAreaView className="bg-page px-8">
      <ScrollView
        className="mt-4 flex-1"
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()}>
          <Feather
            name="arrow-left"
            size={scale(30)}
            color="black"
          />
        </Pressable>
        <View className="mt-4 gap-6 pb-8">
          <Text className="text-body-medium font-bold">서비스 이용약관</Text>

          <Text className="text-body-small">
            본 약관은 허태웅(이하 &apos;운영자&apos;)이 제공하는
            &apos;파도(Pado)&apos; 서비스(이하 &apos;서비스&apos;)의 이용 조건
            및 절차, 이용자와 운영자의 권리, 의무 및 책임 사항을 규정함을
            목적으로 합니다.
          </Text>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              제 1 조 (약관의 효력 및 변경)
            </Text>
            <Text className="text-body-small">
              1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에게 효력이
              발생합니다.{'\n'}2. 운영자는 필요한 경우 관련 법령을 위배하지 않는
              범위에서 본 약관을 개정할 수 있으며, 변경된 사항은 앱 내
              공지사항을 통해 게시합니다.
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              제 2 조 (서비스의 목적 및 성격 - 중요)
            </Text>
            <Text className="text-body-small">
              1. &apos;파도&apos;는 수용전념치료(ACT) 원리에 기반하여 이용자의
              일상적 불안 관리를 돕는 자기관리 도구입니다.{'\n'}2. 본 서비스는
              전문적인 의료 진단, 심리 치료, 혹은 의학적 처방을 대체할 수
              없습니다.{'\n'}3. 자해, 타해의 위험이 있거나 심각한 정신적 고통을
              겪고 계신 경우, 반드시 즉시 전문 의료기관이나 관련 상담 센터를
              방문하셔야 합니다.
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              제 3 조 (이용계약의 성립)
            </Text>
            <Text className="text-body-small">
              1. 이용계약은 이용자가 구글 또는 카카오 소셜 로그인을 통해 본
              약관에 동의하고 서비스를 이용함으로써 성립됩니다.{'\n'}2. 모든
              데이터는 이용자의 계정과 연동되어 별도의 서버(Spring/Oracle
              Cloud)에 안전하게 보관됩니다.
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              제 4 조 (서비스 이용 및 제한)
            </Text>
            <Text className="text-body-small">
              1. 이용자는 서비스를 자유롭게 이용할 수 있으나, 다음 각 호에
              해당하는 행위를 해서는 안 됩니다.
            </Text>
            <Text className="text-body-small">
              • 타인의 계정 정보를 도용하는 행위{'\n'}• 서비스의 정상적인 운영을
              방해하거나 서버에 부하를 주는 행위{'\n'}• 운영자가 게시한 정보의
              무단 복제 및 상업적 이용
            </Text>
            <Text className="text-body-small">
              2. 운영자는 위 사항을 위반한 이용자에 대해 서비스 이용을
              제한하거나 계정을 삭제할 수 있습니다.
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              제 5 조 (데이터의 저작권 및 책임)
            </Text>
            <Text className="text-body-small">
              1. 이용자가 앱 내에 입력한 기록(마음 일기, 가치 등)에 대한
              저작권은 이용자 본인에게 있습니다.{'\n'}2. 운영자는 서비스 제공 및
              동의 기반의 분석(PostHog)을 위해 필요한 범위 내에서 해당 데이터를
              처리할 수 있으며, 이는 개인정보 처리방침에 따라 엄격히 보호됩니다.
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              제 6 조 (면책 조항)
            </Text>
            <Text className="text-body-small">
              1. 운영자는 천재지변, 서버 점검, 통신 장애 등 불가항력적인 사유로
              인해 서비스를 제공할 수 없는 경우 책임을 지지 않습니다.{'\n'}2.
              이용자가 서비스를 통해 얻은 정보나 콘텐츠를 신뢰하여 발생한 결과에
              대해 운영자는 의학적/법적 책임을 지지 않습니다.
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              제 7 조 (준거법 및 재판관할)
            </Text>
            <Text className="text-body-small">
              본 약관과 관련하여 발생한 분쟁에 대해서는 대한민국 법령을
              준거법으로 하며, 운영자의 소재지를 관할하는 법원을 합의 관할
              법원으로 합니다.
            </Text>
          </View>

          <View className="mt-4 gap-2">
            <Text className="text-body-small">시행일: 2026년 1월 10일</Text>
          </View>
        </View>
      </ScrollView>
    </PageSafeAreaView>
  );
}
