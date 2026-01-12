import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { NavButton, Text, View } from '@src/components/ui';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <PageSafeAreaView className="bg-page px-8">
      <ScrollView
        className="mt-4 flex-1"
        showsVerticalScrollIndicator={false}
      >
        <NavButton
          variant="back"
          size="large"
          onPress={() => router.back()}
        />
        <View className="mt-4 gap-6 pb-8">
          <Text className="text-body-medium font-bold">개인정보 처리방침</Text>

          <Text className="text-body-small">
            본 개인정보 처리방침은 &apos;파도(Pado)&apos;(이하 &apos;앱&apos;)가
            이용자의 개인정보를 어떻게 수집, 이용, 보호하는지에 대해 설명합니다.
          </Text>

          <View className="gap-3">
            <Text className="font- text-body-medium">
              1. 개인정보의 처리 목적
            </Text>
            <Text className="text-body-small">
              앱은 다음의 목적을 위해 최소한의 개인정보를 처리합니다. 처리하고
              있는 개인정보는 목적 이외의 용도로는 이용되지 않으며, 이용 목적이
              변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할
              예정입니다.
            </Text>
            <Text className="text-body-small">
              • 서비스 제공 및 본인 식별: 구글/카카오 소셜 로그인을 통한 회원
              식별 및 서비스 이용 권한 부여.{'\n'}• 서비스 관리 및 개선:
              이용자의 심리적 데이터(불안 기록, 일기 등) 저장 및 동의 기반의
              서비스 분석(PostHog).{'\n'}• 문의 응대: 사용자 문의 사항에 대한
              답변 및 고객 지원.
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              2. 수집하는 개인정보의 항목 및 방법
            </Text>
            <Text className="text-body-small">
              앱은 원활한 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.
            </Text>
            <Text className="text-body-small">
              • 로그인 정보 (필수): 구글 또는 카카오 로그인 시 제공되는 고유
              식별값, 이메일, 프로필 이름.{'\n'}• 서비스 이용 데이터 (선택):
              마음 일기 내용, 생각 거리두기 문구, 가치 및 전념행동 기록 등
              사용자가 앱 내에 입력한 텍스트 데이터.{'\n'}• 자동 수집 항목:
              서비스 이용 기록, 기기 정보, 오류 로그 (PostHog 분석 도구 활용).
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              3. 개인정보의 보유 및 이용 기간
            </Text>
            <Text className="text-body-small">
              이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용 목적이
              달성되면 지체 없이 파기합니다.
            </Text>
            <Text className="text-body-small">
              • 회원 탈퇴 시: 수집된 모든 개인정보 및 서비스 이용 기록은 즉시
              파기됩니다.{'\n'}
              단, 관계 법령의 규정에 의하여 보존할 필요가 있는 경우 해당
              기간까지 보관합니다.
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              4. 개인정보의 파기 절차 및 방법
            </Text>
            <Text className="text-body-small">
              이용자의 개인정보는 목적 달성 후 별도의 DB에 옮겨져 내부 방침 및
              법령에 따라 일정 기간 저장된 후 파기됩니다. 전자적 파일 형태의
              정보는 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제합니다.
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              5. 이용자의 권리 및 행사 방법
            </Text>
            <Text className="text-body-small">
              이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며,
              회원 탈퇴를 통해 개인정보 이용에 대한 동의를 철회할 수 있습니다.
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              6. 개인정보 자동 수집 장치의 설치·운영 및 거부
            </Text>
            <Text className="text-body-small">
              앱은 서비스 개선 및 이용자 경험 분석을 위해 PostHog를 사용합니다.
              PostHog는 이용자의 행태 정보를 수집할 수 있으나, 이는 특정 개인을
              식별할 수 없는 비식별 정보로 관리됩니다.
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              7. 개인정보의 안전성 확보 조치
            </Text>
            <Text className="text-body-small">
              앱은 이용자의 개인정보를 안전하게 관리하기 위해 다음과 같은 조치를
              취하고 있습니다.
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-body-medium font-semibold">
              8. 개인정보 보호 책임자 및 연락처
            </Text>
            <Text className="text-body-small">
              앱의 서비스를 이용하시며 발생하는 모든 개인정보 보호 관련 민원은
              아래의 책임자에게 문의하실 수 있습니다.
            </Text>
            <Text className="text-body-small">
              • 성명: 허태웅 (Heo Taewoong){'\n'}• 이메일: tw.heo24@gmail.com
            </Text>
          </View>

          <View className="mt-4 gap-2">
            <Text className="text-body-small">공고 일자: 2026년 1월 10일</Text>
            <Text className="text-body-small">시행 일자: 2026년 1월 10일</Text>
          </View>
        </View>
      </ScrollView>
    </PageSafeAreaView>
  );
}
