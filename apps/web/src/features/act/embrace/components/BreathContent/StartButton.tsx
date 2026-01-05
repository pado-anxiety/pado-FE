import { Button, Text } from '@pado/ui';

type StartButtonProps = {
  onClick: () => void;
};

export function StartButton({ onClick }: StartButtonProps) {
  return (
    <Button
      text="호흡 시작하기"
      size="default"
      fullWidth={false}
      className="bg-btn-act-page px-12 py-5 rounded-2xl shadow-lg"
      onClick={onClick}
    >
      <Text className="text-body-small text-white font-bold">
        호흡 시작하기
      </Text>
    </Button>
  );
}
