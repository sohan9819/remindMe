'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <NextThemesProvider attribute={'class'} enableSystem>
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProvider;
