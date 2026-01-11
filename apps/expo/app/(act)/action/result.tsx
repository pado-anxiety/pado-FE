import { useRef } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import WebView from 'react-native-webview';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { actAPI } from '@src/lib/api/act';
import { parseJSON, safeStringify } from '@src/lib/json';
import { ROUTES, WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export default function ActionResultScreen() {
  const { data } = useLocalSearchParams();
  const { t } = useTranslation();
  const router = useRouter();
  const hasMutated = useRef(false);

  const parsedData = parseJSON(data as string, () => {
    Alert.alert(t('common.error.generic'), t('common.error.tryLater'));
    router.replace(ROUTES.HOME);
  });

  // TODO: offline-first save
  const actionMutation = useMutation({
    mutationFn: ({
      diagnosis,
      matter,
      value,
      barrier,
      action,
    }: {
      diagnosis: {
        work: number;
        growth: number;
        leisure: number;
        relationship: number;
      };
      matter: string;
      value: string;
      barrier: string;
      action: string;
    }) => actAPI.values({ diagnosis, matter, value, barrier, action }),
    onError: (error) => {
      console.error('Failed to save action result', error);
    },
  });

  const handleMessage = createWebViewMessageHandler({
    onNavigate: (action) => {
      if (action === 'HOME') {
        if (!hasMutated.current) {
          hasMutated.current = true;

          actionMutation.mutate({
            diagnosis: parsedData.selectedValue,
            matter: parsedData.selectedDomain.toUpperCase(),
            value: parsedData.orientation,
            barrier: parsedData.obstacle,
            action: parsedData.action,
          });
        }
        router.replace(ROUTES.HOME);
      }
    },
  });

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.ACTION.RESULT}`,
        }}
        onMessage={handleMessage}
        injectedJavaScriptBeforeContentLoaded={`
            window.actionResult = ${safeStringify(parsedData)};
            true;
        `}
        startInLoadingState={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        renderLoading={() => (
          <WebViewLoadingView>
            <LoadingSpinner />
          </WebViewLoadingView>
        )}
        renderError={() => (
          <WebViewErrorView onPressHome={() => router.replace(ROUTES.HOME)} />
        )}
      />
    </PageSafeAreaView>
  );
}
