import { Value } from '../hooks/useActionStep';
import {
  CommittedActionStep,
  ObstacleStep,
  OrientationStep,
  ValueCheckStep,
} from './steps';

type StepContentProps = {
  stepIndex: number;
  selectedValue: Value;
  selectedDomain: keyof Value;
  lowestDomains: (keyof Value)[];
  orientation: string;
  obstacle: string;
  action: string;
  onSelectValue: (key: keyof Value, value: number) => void;
  onSelectDomain: (domain: keyof Value) => void;
  onOrientationChange: (text: string) => void;
  onObstacleChange: (text: string) => void;
  onActionChange: (text: string) => void;
};

export function StepContent({
  stepIndex,
  selectedValue,
  selectedDomain,
  lowestDomains,
  orientation,
  obstacle,
  action,
  onSelectValue,
  onSelectDomain,
  onOrientationChange,
  onObstacleChange,
  onActionChange,
}: StepContentProps) {
  switch (stepIndex) {
    case 0:
      return (
        <ValueCheckStep
          selectedValue={selectedValue}
          onSelectValue={onSelectValue}
        />
      );
    case 1:
      return (
        <OrientationStep
          selectedDomain={selectedDomain}
          lowestDomains={lowestDomains}
          orientation={orientation}
          onSelectDomain={onSelectDomain}
          onOrientationChange={onOrientationChange}
        />
      );
    case 2:
      return (
        <ObstacleStep
          obstacle={obstacle}
          onObstacleChange={onObstacleChange}
        />
      );
    case 3:
      return (
        <CommittedActionStep
          action={action}
          onActionChange={onActionChange}
        />
      );
    default:
      return null;
  }
}
