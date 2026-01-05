import { Button, Text } from '@pado/ui';

type RestartButtonProps = {
  onClick: () => void;
};

export function RestartButton({ onClick }: RestartButtonProps) {
  return (
    <Button
      text="다시 호흡하기"
      size="default"
      color="primary"
      fullWidth={false}
      className="px-20 py-5 rounded-2xl shadow-lg bg-transparent"
      onClick={onClick}
    >
      <Text className="text-body-small font-bold text-white underline">
        다시 호흡하기
      </Text>
    </Button>
  );
}
