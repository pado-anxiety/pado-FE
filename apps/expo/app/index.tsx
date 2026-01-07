import { useState } from 'react';

import { View } from '@src/components/ui';
import { HistoryDeepSeaSection } from '@src/features/History/HistoryDeepSeaSection';
import HistorySkySection from '@src/features/History/HistorySkySection';
import { DeepSeaSection, SkySection, WaveHorizon } from '@src/features/home/';
import { useAuth } from '@src/lib/auth';
import { ROUTES } from '@src/lib/route';
import { Redirect } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

function Page({
  page,
  setPage,
}: {
  page: 'HOME' | 'HISTORY' | 'CHAT';
  setPage: (page: 'HOME' | 'HISTORY' | 'CHAT') => void;
}) {
  let MetaContent = null;
  let Content = null;

  switch (page) {
    case 'HOME':
      MetaContent = <SkySection setPage={setPage} />;
      Content = <DeepSeaSection />;
      break;
    case 'HISTORY':
      MetaContent = <HistorySkySection />;
      Content = <HistoryDeepSeaSection />;
      break;
  }

  return (
    <>
      {MetaContent}
      <WaveHorizon />
      {Content}
    </>
  );
}

export default function HomeScreen(): React.ReactNode {
  const [page, setPage] = useState<'HOME' | 'HISTORY' | 'CHAT'>('HOME');

  const { isLoggedIn, accessToken, refreshToken } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href={ROUTES.LOGIN} />;
  }

  console.log('accessToken: ', accessToken);
  console.log('refreshToken: ', refreshToken);

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <Page
          page={page}
          setPage={setPage}
        />
      </ScrollView>
    </View>
  );
}
