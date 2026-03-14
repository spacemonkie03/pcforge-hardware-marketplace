import React from 'react';
import { PageLayout } from './layout/PageLayout';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <PageLayout>{children}</PageLayout>;
};

