import { useRef } from 'react';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import WebView from 'react-native-webview';

import PageSafeAreaView from '@src/components/layout/page-safe-area-view';
import {
  LoadingSpinner,
  WebViewErrorView,
  WebViewLoadingView,
} from '@src/components/ui';
import { actAPI } from '@src/lib/api/act';
import { WEBVIEW_ROUTES, getWebViewBaseURL } from '@src/lib/route';
import { ROUTES } from '@src/lib/route/route';
import { createWebViewMessageHandler } from '@src/lib/webview';

export default function AnchorResultScreen() {
  const router = useRouter();
  const hasMutated = useRef(false);

  // TODO: offline-first save
  const anchorMutation = useMutation({
    mutationFn: () => actAPI.anchor(),
    onError: (error) => {
      console.error(error);
    },
  });

  const handleMessage = createWebViewMessageHandler({
    onNavigate: () => {
      if (!hasMutated.current) {
        hasMutated.current = true;
        anchorMutation.mutate();
      }
      router.replace(ROUTES.HOME);
    },
  });

  return (
    <PageSafeAreaView className="flex flex-1 bg-act-page">
      <WebView
        source={{
          uri: `${getWebViewBaseURL()}${WEBVIEW_ROUTES.ACT.ANCHOR.RESULT}`,
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
      />
    </PageSafeAreaView>
  );
}
