import { useState } from 'react';
import { RouterProvider, type RouterProviderProps } from 'react-router';
import { AppProviders } from './providers';
import { createAppRouter } from './routes';

type AppProps = {
  router?: RouterProviderProps['router'];
};

export function App({ router }: AppProps) {
  const [appRouter] = useState(() => router ?? createAppRouter());

  return (
    <AppProviders>
      <RouterProvider router={appRouter} />
    </AppProviders>
  );
}
