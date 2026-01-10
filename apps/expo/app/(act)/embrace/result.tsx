import { useRef } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import WebView from 'react-native-webview';

import { PageSafeAreaView } from '@src/components/layout/indext';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { actAPI } from '@src/lib/api/act';
import { parseJSON, safeStringify } from '@src/lib/json';
import { WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { ROUTES } from '@src/lib/route/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export default function EmbraceResultScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data } = useLocalSearchParams();
  const hasMutated = useRef(false);
  const parsedData = parseJSON(data as string, () => {
    Alert.alert(t('common.error.generic'), t('common.error.tryLater'));
    router.replace(ROUTES.HOME);
  });

  // TODO: offline-first save
  const embraceMutation = useMutation({
    mutationFn: ({ breathingTime }: { breathingTime: number }) =>
      actAPI.embrace({ breathingTime }),
    onError: (error) => {
      console.error('Failed to save embrace result', error);
    },
  });

  const handleMessage = createWebViewMessageHandler({
    onNavigate: () => {
      if (!hasMutated.current) {
        hasMutated.current = true;
        embraceMutation.mutate({
          breathingTime: parsedData.breathingTime,
        });
      }
      router.replace(ROUTES.HOME);
    },
  });

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.EMBRACE.RESULT}`,
        }}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <WebViewLoadingView>
            <LoadingSpinner />
          </WebViewLoadingView>
        )}
        renderError={() => (
          <WebViewErrorView onPressHome={() => router.replace(ROUTES.HOME)} />
        )}
        onMessage={handleMessage}
        injectedJavaScriptBeforeContentLoaded={`
            window.embraceResult = ${safeStringify(parsedData.embraceResult)};
            true;
        `}
      />
    </PageSafeAreaView>
  );
}
