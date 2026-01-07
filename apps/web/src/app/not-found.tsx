import { Text } from '@pado/ui';

import PageLayout from '@/components/ui/layout';

export default function NotFound() {
  return (
    <PageLayout className="bg-act-page">
      <div className="flex flex-1 items-center justify-center">
        <Text className="text-title-large text-center">
          페이지를 찾을 수 없습니다
        </Text>
      </div>
    </PageLayout>
  );
}
