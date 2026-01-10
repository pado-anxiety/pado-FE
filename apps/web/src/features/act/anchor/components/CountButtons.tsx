import { Text } from '@pado/ui';

import { triggerHaptic } from '@/lib';

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
  const handleSelect = (index: number) => {
    triggerHaptic('SELECT');
    onSelect(index);
  };

  return (
    <div className="flex flex-row gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={`${index + 1}`}
          onClick={() => handleSelect(index + 1)}
          className="p-4 rounded-2xl"
          style={{
            backgroundColor: index === selectedIndex ? '#2E476B' : '#B9CDE5',
            color: index === selectedIndex ? '#FFFFFF' : '',
            opacity: index < selectedIndex ? 0.5 : 1,
          }}
          disabled={index !== selectedIndex}
        >
          <Text className="text-body-medium">{index + 1}</Text>
        </button>
      ))}
    </div>
  );
}
