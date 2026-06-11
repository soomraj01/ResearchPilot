// React import removed
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../pages/Dashboard';
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';

import WorkspaceView from '../features/workspace/WorkspaceView';
import PaperDiscoveryView from '../features/papers/PaperDiscoveryView';
import ChatView from '../features/chat/ChatView';
import InsightsView from '../features/insights/InsightsView';
import ArtifactsView from '../features/artifacts/ArtifactsView';

import ProfileView from '../features/profile/ProfileView';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'profile',
        element: <ProfileView />,
      },
      {
        path: 'workspace',
        element: <WorkspaceView />,
      },
      {
        path: 'workspace/:workspaceId/papers',
        element: <PaperDiscoveryView />,
      },
      {
        path: 'workspace/:workspaceId/chat',
        element: <ChatView />,
      },
      {
        path: 'workspace/:workspaceId/insights',
        element: <InsightsView />,
      },
      {
        path: 'workspace/:workspaceId/artifacts',
        element: <ArtifactsView />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
