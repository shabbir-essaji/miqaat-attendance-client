import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Members from './pages/Members';
import Dashboard from './pages/Dashboard';
import ErrorPage from './pages/Errorpage';
import service from './pages/service';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    loader: async () => {
      return service.getMiqaats();
    },
    errorElement: <ErrorPage />
  },
  {
    path: '/members',
    element: <Members />,
    errorElement: <ErrorPage />
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    errorElement: <ErrorPage />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
