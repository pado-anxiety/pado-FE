import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { scale } from 'react-native-size-matters';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import { Pressable, Text, View } from '@src/components/ui';
import { useLanguage } from '@src/lib/i18n';

export default function LanguageScreen() {
  const router = useRouter();
  const { changeLanguage, language } = useLanguage();

  const handleChangeLanguage = (language: string) => {
    changeLanguage(language);
  };

  return (
    <PageSafeAreaView className="gap-2 bg-page px-8">
      <Pressable onPress={() => router.back()}>
        <Feather
          name="arrow-left"
          size={scale(24)}
          color="black"
        />
      </Pressable>
      <View className="mt-4 flex flex-col gap-6">
        <Pressable
          className="flex flex-row items-center justify-between"
          onPress={() => handleChangeLanguage('en')}
        >
          <Text className="text-body-small">English</Text>
          <Ionicons
            name={language === 'en' ? 'radio-button-on' : 'radio-button-off'}
            size={scale(24)}
            color="black"
          />
        </Pressable>
        <Pressable
          className="flex flex-row items-center justify-between"
          onPress={() => handleChangeLanguage('ko')}
        >
          <Text className="text-body-small">한국어</Text>
          <Ionicons
            name={language === 'ko' ? 'radio-button-on' : 'radio-button-off'}
            size={scale(24)}
            color="black"
          />
        </Pressable>
      </View>
    </PageSafeAreaView>
  );
}
