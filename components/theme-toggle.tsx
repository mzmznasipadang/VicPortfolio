'use client';

import { Moon, Sun } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  }

  return <Button aria-label="Toggle night mode" aria-pressed={dark} onClick={toggleTheme} size="icon" variant="outline">{dark ? <Sun /> : <Moon />}</Button>;
}
