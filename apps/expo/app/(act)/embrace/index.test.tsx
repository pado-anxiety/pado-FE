import { render } from '@testing-library/react-native';

import EmbraceRoute from './index';

jest.mock('@src/features/act/embrace/EmbraceScreen', () => ({
  EmbraceScreen: () => null,
}));

describe('EmbraceRoute', () => {
  it('렌더링된다', () => {
    const { toJSON } = render(<EmbraceRoute />);
    expect(toJSON()).toBeNull();
  });
});
