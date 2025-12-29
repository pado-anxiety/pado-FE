import { Text } from '@pado/ui';

type CountButtonsProps = {
  count: number;
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export function CountButtons({
  count,
  selectedIndex,
  onSelect,
}: CountButtonsProps) {
  return (
    <div className="flex flex-row gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={`${index + 1}`}
          onClick={() => onSelect(index + 1)}
          className={`p-4 rounded-full ${index === selectedIndex ? 'bg-primary' : 'bg-gray-200'} ${index < selectedIndex ? 'opacity-50' : 'opacity-100'}`}
          disabled={index !== selectedIndex}
        >
          <Text className="text-body-large">{index + 1}</Text>
        </button>
      ))}
    </div>
  );
}
