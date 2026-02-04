import { useMemo } from 'react';

import WebView, { WebViewProps } from 'react-native-webview';

import { useLanguage } from '@src/lib/i18n';
import { getWebViewBaseURL } from '@src/lib/route';

import { LoadingSpinner, WebViewLoadingView } from './ui';

interface CustomWebViewProps extends WebViewProps {
  route: string;
  renderError: WebViewProps['renderError'];
}

const buildUri = (
  baseUrl: string,
  route: string,
  params: Record<string, string | undefined>,
) => {
  const url = new URL(
    `${baseUrl}${route.startsWith('/') ? route : `/${route}`}`,
  );

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

export function CustomWebView({
  route,
  renderError,
  ...props
}: CustomWebViewProps) {
  const { language } = useLanguage();

  const source = useMemo(() => {
    const uri = buildUri(getWebViewBaseURL(), route, { lang: language });
    return {
      uri,
    };
  }, [route, language]);

  return (
    <WebView
      {...props}
      source={source}
      renderLoading={() => (
        <WebViewLoadingView>
          <LoadingSpinner />
        </WebViewLoadingView>
      )}
      renderError={renderError}
    />
  );
}
