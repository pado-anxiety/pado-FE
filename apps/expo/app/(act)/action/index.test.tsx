import { render } from '@testing-library/react-native';

import ActionRoute from './index';

jest.mock('@src/features/act/action/ActionScreen', () => ({
  ActionScreen: () => null,
}));

describe('ActionRoute', () => {
  it('렌더링된다', () => {
    const { toJSON } = render(<ActionRoute />);
    expect(toJSON()).toBeNull();
  });
});
