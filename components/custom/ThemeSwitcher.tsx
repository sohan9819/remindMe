'use client';
import { useTheme } from 'next-themes';
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MonitorCog, MoonIcon, SunIcon } from 'lucide-react';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const onClickHandler = (themeColor: string) => () => setTheme(themeColor);

  // To avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Tabs defaultValue={theme}>
      <TabsList className='border dark:border-neutral-800 dark:bg-[#030303]'>
        <TabsTrigger value='light' onClick={onClickHandler('light')}>
          <SunIcon />
        </TabsTrigger>
        <TabsTrigger value='dark' onClick={onClickHandler('dark')}>
          <MoonIcon />
        </TabsTrigger>
        <TabsTrigger value='system' onClick={onClickHandler('system')}>
          <MonitorCog />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ThemeSwitcher;
