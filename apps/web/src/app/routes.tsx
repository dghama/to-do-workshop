import { createBrowserRouter, type RouteObject } from 'react-router';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../modules/home';
import { NotFoundPage } from '../pages/NotFoundPage';

export const routeDefinitions: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(routeDefinitions);
}
