import { Text } from '@pado/ui';

interface ErrorFallbackProps {
  message?: string;
  description?: string;
}

export default function ErrorFallback({
  message = '오류가 발생했어요!',
  description = '잠시후 다시 시도해주세요',
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col flex-1 justify-center items-center gap-2 w-full">
      <Text className="text-body-large text-center">{message}</Text>
      <Text className="text-body-large text-center text-gray-500">
        {description}
      </Text>
    </div>
  );
}
