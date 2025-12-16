import '@testing-library/jest-native/extend-expect';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  const TouchableOpacity = require('react-native/Libraries/Components/Touchable/TouchableOpacity');
  const TextInput = require('react-native/Libraries/Components/TextInput/TextInput');
  const ScrollView = require('react-native/Libraries/Components/ScrollView/ScrollView');
  const FlatList = require('react-native/Libraries/Lists/FlatList');
  
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView,
    Slider: View,
    Switch: View,
    TextInput,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList,
    gestureHandlerRootHOC: jest.fn((Component) => Component),
    Directions: {},
    TouchableOpacity,
    GestureHandlerRootView: View,
  };
});

// Mock react-native-keyboard-controller
jest.mock('react-native-keyboard-controller', () => ({
  useKeyboardHandler: jest.fn(() => {}),
  KeyboardProvider: ({ children }) => children,
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
}));

// Mock expo vector icons
jest.mock('@expo/vector-icons', () => ({
  FontAwesome: 'FontAwesome',
  Ionicons: 'Ionicons',
  Entypo: 'Entypo',
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');