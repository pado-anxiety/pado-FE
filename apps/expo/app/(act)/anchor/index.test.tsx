import { render } from '@testing-library/react-native';

import AnchorRoute from './index';

jest.mock('@src/features/act/anchor/AnchorScreen', () => ({
  AnchorScreen: () => null,
}));

describe('AnchorRoute', () => {
  it('렌더링된다', () => {
    const { toJSON } = render(<AnchorRoute />);
    expect(toJSON()).toBeNull();
  });
});
