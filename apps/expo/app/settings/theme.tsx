import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { scale } from 'react-native-size-matters';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { NavButton, Pressable, Text, View } from '@src/components/ui';
import { useIconColor, useTheme } from '@src/lib/theme';

type ThemeType = 'light' | 'dark' | 'system';

const THEME_OPTIONS: ThemeType[] = ['light', 'dark', 'system'];

export default function ThemeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { storedTheme, changeTheme } = useTheme();
  const { iconPrimary } = useIconColor();

  return (
    <PageSafeAreaView className="mt-4 gap-2 bg-page px-8">
      <View className="relative">
        <View className="absolute left-[-7px]">
          <NavButton
            variant="back"
            size="large"
            onPress={() => router.back()}
          />
        </View>
      </View>
      <View className="mt-16 flex flex-col gap-6">
        {THEME_OPTIONS.map((option) => (
          <Pressable
            key={option}
            className="flex flex-row items-center justify-between"
            onPress={() => changeTheme(option)}
          >
            <Text preset="body">
              {t(`common.settings.themeOptions.${option}`)}
            </Text>
            <Ionicons
              name={
                storedTheme === option ? 'radio-button-on' : 'radio-button-off'
              }
              size={scale(24)}
              color={iconPrimary}
            />
          </Pressable>
        ))}
      </View>
    </PageSafeAreaView>
  );
}
