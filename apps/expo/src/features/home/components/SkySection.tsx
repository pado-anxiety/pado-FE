import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

import {
  AnimatedText,
  Button,
  Text,
  TouchableOpacity,
  View,
} from '@src/components/ui';
import { useLanguage } from '@src/lib/i18n';
import { ROUTES } from '@src/lib/route';

export function SkySection({
  setPage,
}: {
  setPage: (page: 'HOME' | 'HISTORY' | 'CHAT') => void;
}): React.ReactNode {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { changeLanguage, language } = useLanguage();

  return (
    <View
      className="flex flex-col items-start justify-center gap-4 bg-page px-8"
      style={{
        paddingTop: insets.top + scale(50),
      }}
    >
      <View className="flex w-full flex-col gap-8">
        <AnimatedText
          delay={1000}
          className="text-2xl font-medium"
        >
          <Text tx="home.greeting" />
        </AnimatedText>
        <View className="flex w-full flex-col gap-6">
          <TouchableOpacity
            className="flex flex-col"
            onPress={() => setPage('HISTORY')}
          >
            <AnimatedText
              delay={1500}
              className="text-4xl font-medium text-slate-700"
            >
              {t('home.menu.viewActHistory')}
            </AnimatedText>
            <Animated.View
              className="mt-1 h-[1.5px] w-full bg-slate-300"
              entering={FadeIn.duration(1500)}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col"
            onPress={() => setPage('CHAT')}
          >
            <AnimatedText
              delay={2000}
              className="text-4xl font-medium text-slate-700"
            >
              {t('home.menu.chatWithWind')}
            </AnimatedText>
            <Animated.View
              className="mt-1 h-[1.5px] w-full bg-slate-300"
              entering={FadeIn.duration(2000)}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col"
            onPress={() => setPage('CHAT')}
          >
            <AnimatedText
              delay={2000}
              className="text-4xl font-medium text-slate-700"
            >
              {t('home.menu.learning')}
            </AnimatedText>
            <Animated.View
              className="mt-1 h-[1.5px] w-full bg-slate-300"
              entering={FadeIn.duration(2000)}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col"
            onPress={() => router.push(ROUTES.ONBOARD)}
          >
            <AnimatedText
              delay={2000}
              className="text-4xl font-medium text-slate-700"
            >
              {t('home.menu.onboarding')}
            </AnimatedText>
            <Animated.View
              className="mt-1 h-[1.5px] w-full bg-slate-300"
              entering={FadeIn.duration(2000)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col"
            onPress={() => router.push(ROUTES.LOGIN)}
          >
            <AnimatedText
              delay={2000}
              className="text-4xl font-medium text-slate-700"
            >
              {t('home.menu.login')}
            </AnimatedText>
            <Animated.View
              className="mt-1 h-[1.5px] w-full bg-slate-300"
              entering={FadeIn.duration(2000)}
            />
          </TouchableOpacity>
          <Button
            text={'언어 변경'}
            onPress={() => changeLanguage(language === 'en' ? 'ko' : 'en')}
          />
        </View>
      </View>
    </View>
  );
}
