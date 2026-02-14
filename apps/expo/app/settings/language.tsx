import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { scale } from 'react-native-size-matters';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { NavButton, Pressable, Text, View } from '@src/components/ui';
import { useLanguage } from '@src/lib/i18n';
import { useIconColor } from '@src/lib/theme';

export default function LanguageScreen() {
  const router = useRouter();
  const { changeLanguage, language } = useLanguage();
  const { iconPrimary } = useIconColor();

  const handleChangeLanguage = (language: string) => {
    changeLanguage(language);
  };

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
        <Pressable
          className="flex flex-row items-center justify-between"
          onPress={() => handleChangeLanguage('en')}
        >
          <Text preset="body">English</Text>
          <Ionicons
            name={language === 'en' ? 'radio-button-on' : 'radio-button-off'}
            size={scale(24)}
            color={iconPrimary}
          />
        </Pressable>
        <Pressable
          className="flex flex-row items-center justify-between"
          onPress={() => handleChangeLanguage('ko')}
        >
          <Text preset="body">한국어</Text>
          <Ionicons
            name={language === 'ko' ? 'radio-button-on' : 'radio-button-off'}
            size={scale(24)}
            color={iconPrimary}
          />
        </Pressable>
      </View>
    </PageSafeAreaView>
  );
}
