import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { ThemeMode } from '../types';

export type { ThemeMode };

export interface ThemeTokens {
  background: {
    primary: string;
    secondary: string;
    card: string;
    subtle: string;
  };
  surface: {
    card: string;
    subtle: string;
  };
  border: {
    default: string;
    subtle: string;
    accent: string;
    accentGlow: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
  };
  accent: {
    primary: string;
    secondary: string;
    light: string;
    dark: string;
    glow: string;
    rgb: string;
  };
  charts: {
    primary: string;
    secondary: string;
    accent: string;
    grid: string;
    tooltipBg: string;
    text: string;
  };
  success: string;
  warning: string;
  danger: string;
}

export const THEME_DEFINITIONS: Record<ThemeMode, { name: string; description: string; tokens: ThemeTokens }> = {
  'dark-cyber': {
    name: 'Dark Cyber',
    description: 'Deep navy background with high-contrast cyan tactical accents',
    tokens: {
      background: {
        primary: '#090D18',
        secondary: '#101726',
        card: '#111B2D',
        subtle: '#16233B'
      },
      surface: {
        card: '#111B2D',
        subtle: '#16233B'
      },
      border: {
        default: 'rgba(0, 242, 254, 0.12)',
        subtle: 'rgba(0, 242, 254, 0.06)',
        accent: 'rgba(0, 242, 254, 0.35)',
        accentGlow: 'rgba(0, 242, 254, 0.5)'
      },
      text: {
        primary: '#F4F4F5',
        secondary: '#A1A1AA',
        muted: '#71717A',
        accent: '#00F2FE'
      },
      accent: {
        primary: '#00F2FE',
        secondary: '#0284C7',
        light: '#38BDF8',
        dark: '#083344',
        glow: 'rgba(0, 242, 254, 0.35)',
        rgb: '0, 242, 254'
      },
      charts: {
        primary: '#00F2FE',
        secondary: '#38BDF8',
        accent: '#0284C7',
        grid: 'rgba(0, 242, 254, 0.08)',
        tooltipBg: '#111B2D',
        text: '#A1A1AA'
      },
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444'
    }
  },
  'neon-blue': {
    name: 'Neon Blue',
    description: 'Dark obsidian background with bright electric blue accents',
    tokens: {
      background: {
        primary: '#050B17',
        secondary: '#0A1329',
        card: '#0E1B38',
        subtle: '#13244B'
      },
      surface: {
        card: '#0E1B38',
        subtle: '#13244B'
      },
      border: {
        default: 'rgba(59, 130, 246, 0.18)',
        subtle: 'rgba(59, 130, 246, 0.08)',
        accent: 'rgba(59, 130, 246, 0.45)',
        accentGlow: 'rgba(59, 130, 246, 0.65)'
      },
      text: {
        primary: '#F8FAFC',
        secondary: '#94A3B8',
        muted: '#64748B',
        accent: '#60A5FA'
      },
      accent: {
        primary: '#3B82F6',
        secondary: '#1D4ED8',
        light: '#60A5FA',
        dark: '#172554',
        glow: 'rgba(59, 130, 246, 0.4)',
        rgb: '59, 130, 246'
      },
      charts: {
        primary: '#3B82F6',
        secondary: '#60A5FA',
        accent: '#1D4ED8',
        grid: 'rgba(59, 130, 246, 0.1)',
        tooltipBg: '#0E1B38',
        text: '#94A3B8'
      },
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444'
    }
  },
  'monarch-purple': {
    name: 'Monarch Purple',
    description: 'Dark shadow void with royal arcane purple accents',
    tokens: {
      background: {
        primary: '#0C0616',
        secondary: '#140B24',
        card: '#1B1030',
        subtle: '#251642'
      },
      surface: {
        card: '#1B1030',
        subtle: '#251642'
      },
      border: {
        default: 'rgba(168, 85, 247, 0.2)',
        subtle: 'rgba(168, 85, 247, 0.08)',
        accent: 'rgba(168, 85, 247, 0.45)',
        accentGlow: 'rgba(168, 85, 247, 0.65)'
      },
      text: {
        primary: '#FAF5FF',
        secondary: '#E9D5FF',
        muted: '#A855F7',
        accent: '#C084FC'
      },
      accent: {
        primary: '#A855F7',
        secondary: '#7E22CE',
        light: '#C084FC',
        dark: '#3B0764',
        glow: 'rgba(168, 85, 247, 0.4)',
        rgb: '168, 85, 247'
      },
      charts: {
        primary: '#C084FC',
        secondary: '#A855F7',
        accent: '#7E22CE',
        grid: 'rgba(168, 85, 247, 0.1)',
        tooltipBg: '#1B1030',
        text: '#E9D5FF'
      },
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444'
    }
  },
  'emerald-matrix': {
    name: 'Emerald Matrix',
    description: 'Cybernetic matrix deep green with glowing neon emerald terminal accents',
    tokens: {
      background: {
        primary: '#040F0A',
        secondary: '#081C13',
        card: '#0D291D',
        subtle: '#123B2A'
      },
      surface: {
        card: '#0D291D',
        subtle: '#123B2A'
      },
      border: {
        default: 'rgba(16, 185, 129, 0.18)',
        subtle: 'rgba(16, 185, 129, 0.08)',
        accent: 'rgba(16, 185, 129, 0.45)',
        accentGlow: 'rgba(16, 185, 129, 0.65)'
      },
      text: {
        primary: '#ECFDF5',
        secondary: '#A7F3D0',
        muted: '#34D399',
        accent: '#10B981'
      },
      accent: {
        primary: '#10B981',
        secondary: '#059669',
        light: '#34D399',
        dark: '#064E3B',
        glow: 'rgba(16, 185, 129, 0.4)',
        rgb: '16, 185, 129'
      },
      charts: {
        primary: '#10B981',
        secondary: '#34D399',
        accent: '#059669',
        grid: 'rgba(16, 185, 129, 0.1)',
        tooltipBg: '#0D291D',
        text: '#A7F3D0'
      },
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444'
    }
  },
  'crimson-protocol': {
    name: 'Crimson Protocol',
    description: 'Tactical combat red-alert layout with blood obsidian and crimson sentry highlights',
    tokens: {
      background: {
        primary: '#0E0507',
        secondary: '#1A0B0E',
        card: '#281116',
        subtle: '#3B1920'
      },
      surface: {
        card: '#281116',
        subtle: '#3B1920'
      },
      border: {
        default: 'rgba(239, 68, 68, 0.2)',
        subtle: 'rgba(239, 68, 68, 0.08)',
        accent: 'rgba(239, 68, 68, 0.45)',
        accentGlow: 'rgba(239, 68, 68, 0.65)'
      },
      text: {
        primary: '#FEF2F2',
        secondary: '#FECACA',
        muted: '#F87171',
        accent: '#EF4444'
      },
      accent: {
        primary: '#EF4444',
        secondary: '#DC2626',
        light: '#F87171',
        dark: '#7F1D1D',
        glow: 'rgba(239, 68, 68, 0.4)',
        rgb: '239, 68, 68'
      },
      charts: {
        primary: '#EF4444',
        secondary: '#F87171',
        accent: '#DC2626',
        grid: 'rgba(239, 68, 68, 0.1)',
        tooltipBg: '#281116',
        text: '#FECACA'
      },
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444'
    }
  },
  'gold-commander': {
    name: 'Gold Commander',
    description: 'Prestige imperial commander aesthetic with deep regal charcoal and radiant auric gold',
    tokens: {
      background: {
        primary: '#0C0A04',
        secondary: '#171307',
        card: '#231D0B',
        subtle: '#362C12'
      },
      surface: {
        card: '#231D0B',
        subtle: '#362C12'
      },
      border: {
        default: 'rgba(245, 158, 11, 0.22)',
        subtle: 'rgba(245, 158, 11, 0.08)',
        accent: 'rgba(245, 158, 11, 0.45)',
        accentGlow: 'rgba(245, 158, 11, 0.65)'
      },
      text: {
        primary: '#FFFBEB',
        secondary: '#FDE68A',
        muted: '#FBBF24',
        accent: '#F59E0B'
      },
      accent: {
        primary: '#F59E0B',
        secondary: '#D97706',
        light: '#FBBF24',
        dark: '#78350F',
        glow: 'rgba(245, 158, 11, 0.4)',
        rgb: '245, 158, 11'
      },
      charts: {
        primary: '#F59E0B',
        secondary: '#FBBF24',
        accent: '#D97706',
        grid: 'rgba(245, 158, 11, 0.1)',
        tooltipBg: '#231D0B',
        text: '#FDE68A'
      },
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444'
    }
  },
  'arctic-ghost': {
    name: 'Arctic Ghost',
    description: 'Sub-zero polar night aesthetic with ice cyan crystal and frosted titanium accents',
    tokens: {
      background: {
        primary: '#060D15',
        secondary: '#0C1826',
        card: '#122338',
        subtle: '#1A324E'
      },
      surface: {
        card: '#122338',
        subtle: '#1A324E'
      },
      border: {
        default: 'rgba(56, 189, 248, 0.2)',
        subtle: 'rgba(56, 189, 248, 0.08)',
        accent: 'rgba(56, 189, 248, 0.45)',
        accentGlow: 'rgba(56, 189, 248, 0.65)'
      },
      text: {
        primary: '#F0F9FF',
        secondary: '#BAE6FD',
        muted: '#7DD3FC',
        accent: '#38BDF8'
      },
      accent: {
        primary: '#38BDF8',
        secondary: '#0284C7',
        light: '#7DD3FC',
        dark: '#0C4A6E',
        glow: 'rgba(56, 189, 248, 0.4)',
        rgb: '56, 189, 248'
      },
      charts: {
        primary: '#38BDF8',
        secondary: '#7DD3FC',
        accent: '#0284C7',
        grid: 'rgba(56, 189, 248, 0.1)',
        tooltipBg: '#122338',
        text: '#BAE6FD'
      },
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444'
    }
  },
  'obsidian-elite': {
    name: 'Obsidian Elite',
    description: 'Stealth pitch-black minimalist void with refined titanium platinum accents',
    tokens: {
      background: {
        primary: '#040507',
        secondary: '#0B0D12',
        card: '#13161F',
        subtle: '#1D2230'
      },
      surface: {
        card: '#13161F',
        subtle: '#1D2230'
      },
      border: {
        default: 'rgba(226, 232, 240, 0.18)',
        subtle: 'rgba(226, 232, 240, 0.08)',
        accent: 'rgba(226, 232, 240, 0.45)',
        accentGlow: 'rgba(226, 232, 240, 0.65)'
      },
      text: {
        primary: '#F8FAFC',
        secondary: '#CBD5E1',
        muted: '#94A3B8',
        accent: '#E2E8F0'
      },
      accent: {
        primary: '#E2E8F0',
        secondary: '#94A3B8',
        light: '#F8FAFC',
        dark: '#334155',
        glow: 'rgba(226, 232, 240, 0.35)',
        rgb: '226, 232, 240'
      },
      charts: {
        primary: '#E2E8F0',
        secondary: '#94A3B8',
        accent: '#64748B',
        grid: 'rgba(226, 232, 240, 0.08)',
        tooltipBg: '#13161F',
        text: '#CBD5E1'
      },
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444'
    }
  },
  'origin-protocol': {
    name: 'Origin Protocol',
    description: 'The mythic system origin state with chromatic iridescent aura and celestial void',
    tokens: {
      background: {
        primary: '#080512',
        secondary: '#110B22',
        card: '#1C1236',
        subtle: '#2A1C4E'
      },
      surface: {
        card: '#1C1236',
        subtle: '#2A1C4E'
      },
      border: {
        default: 'rgba(244, 63, 94, 0.25)',
        subtle: 'rgba(139, 92, 246, 0.15)',
        accent: 'rgba(6, 182, 212, 0.5)',
        accentGlow: 'rgba(245, 158, 11, 0.7)'
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#E0E7FF',
        muted: '#A5B4FC',
        accent: '#38BDF8'
      },
      accent: {
        primary: '#38BDF8',
        secondary: '#C084FC',
        light: '#F43F5E',
        dark: '#312E81',
        glow: 'rgba(139, 92, 246, 0.5)',
        rgb: '56, 189, 248'
      },
      charts: {
        primary: '#38BDF8',
        secondary: '#C084FC',
        accent: '#F43F5E',
        grid: 'rgba(139, 92, 246, 0.15)',
        tooltipBg: '#1C1236',
        text: '#E0E7FF'
      },
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444'
    }
  }
};

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  tokens: ThemeTokens;
  themeName: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme,
  onThemeChange
}) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('arise_theme') as ThemeMode | null;
    if (saved && THEME_DEFINITIONS[saved]) {
      return saved;
    }
    if (initialTheme && THEME_DEFINITIONS[initialTheme]) {
      return initialTheme;
    }
    return 'dark-cyber';
  });

  const tokens = useMemo(() => {
    return THEME_DEFINITIONS[theme]?.tokens || THEME_DEFINITIONS['dark-cyber'].tokens;
  }, [theme]);

  // Synchronize CSS custom properties and document attribute
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('arise_theme', theme);

    // Apply CSS Variables directly to document root
    root.style.setProperty('--theme-bg-primary', tokens.background.primary);
    root.style.setProperty('--theme-bg-secondary', tokens.background.secondary);
    root.style.setProperty('--theme-surface-card', tokens.surface.card);
    root.style.setProperty('--theme-surface-subtle', tokens.surface.subtle);
    root.style.setProperty('--theme-border-default', tokens.border.default);
    root.style.setProperty('--theme-border-accent', tokens.border.accent);
    root.style.setProperty('--theme-border-accent-glow', tokens.border.accentGlow);
    root.style.setProperty('--theme-text-primary', tokens.text.primary);
    root.style.setProperty('--theme-text-secondary', tokens.text.secondary);
    root.style.setProperty('--theme-text-muted', tokens.text.muted);
    root.style.setProperty('--theme-accent-primary', tokens.accent.primary);
    root.style.setProperty('--theme-accent-secondary', tokens.accent.secondary);
    root.style.setProperty('--theme-accent-light', tokens.accent.light);
    root.style.setProperty('--theme-accent-dark', tokens.accent.dark);
    root.style.setProperty('--theme-accent-glow', tokens.accent.glow);
    root.style.setProperty('--theme-accent-rgb', tokens.accent.rgb);
    root.style.setProperty('--theme-success', tokens.success);
    root.style.setProperty('--theme-warning', tokens.warning);
    root.style.setProperty('--theme-danger', tokens.danger);

    // Dynamic Tailwind cyan override variables for color synchronization
    if (theme === 'neon-blue') {
      root.style.setProperty('--color-cyan-300', '#93C5FD');
      root.style.setProperty('--color-cyan-400', '#60A5FA');
      root.style.setProperty('--color-cyan-500', '#3B82F6');
      root.style.setProperty('--color-cyan-600', '#2563EB');
      root.style.setProperty('--color-cyan-950', '#172554');
    } else if (theme === 'monarch-purple') {
      root.style.setProperty('--color-cyan-300', '#E9D5FF');
      root.style.setProperty('--color-cyan-400', '#C084FC');
      root.style.setProperty('--color-cyan-500', '#A855F7');
      root.style.setProperty('--color-cyan-600', '#9333EA');
      root.style.setProperty('--color-cyan-950', '#3B0764');
    } else if (theme === 'emerald-matrix') {
      root.style.setProperty('--color-cyan-300', '#6EE7B7');
      root.style.setProperty('--color-cyan-400', '#34D399');
      root.style.setProperty('--color-cyan-500', '#10B981');
      root.style.setProperty('--color-cyan-600', '#059669');
      root.style.setProperty('--color-cyan-950', '#064E3B');
    } else if (theme === 'crimson-protocol') {
      root.style.setProperty('--color-cyan-300', '#FCA5A5');
      root.style.setProperty('--color-cyan-400', '#F87171');
      root.style.setProperty('--color-cyan-500', '#EF4444');
      root.style.setProperty('--color-cyan-600', '#DC2626');
      root.style.setProperty('--color-cyan-950', '#7F1D1D');
    } else if (theme === 'gold-commander') {
      root.style.setProperty('--color-cyan-300', '#FDE68A');
      root.style.setProperty('--color-cyan-400', '#FBBF24');
      root.style.setProperty('--color-cyan-500', '#F59E0B');
      root.style.setProperty('--color-cyan-600', '#D97706');
      root.style.setProperty('--color-cyan-950', '#78350F');
    } else if (theme === 'arctic-ghost') {
      root.style.setProperty('--color-cyan-300', '#BAE6FD');
      root.style.setProperty('--color-cyan-400', '#7DD3FC');
      root.style.setProperty('--color-cyan-500', '#38BDF8');
      root.style.setProperty('--color-cyan-600', '#0284C7');
      root.style.setProperty('--color-cyan-950', '#0C4A6E');
    } else if (theme === 'obsidian-elite') {
      root.style.setProperty('--color-cyan-300', '#CBD5E1');
      root.style.setProperty('--color-cyan-400', '#E2E8F0');
      root.style.setProperty('--color-cyan-500', '#94A3B8');
      root.style.setProperty('--color-cyan-600', '#64748B');
      root.style.setProperty('--color-cyan-950', '#1E293B');
    } else if (theme === 'origin-protocol') {
      root.style.setProperty('--color-cyan-300', '#BAE6FD');
      root.style.setProperty('--color-cyan-400', '#38BDF8');
      root.style.setProperty('--color-cyan-500', '#818CF8');
      root.style.setProperty('--color-cyan-600', '#C084FC');
      root.style.setProperty('--color-cyan-950', '#312E81');
    } else {
      root.style.setProperty('--color-cyan-300', '#67E8F9');
      root.style.setProperty('--color-cyan-400', '#00F2FE');
      root.style.setProperty('--color-cyan-500', '#06B6D4');
      root.style.setProperty('--color-cyan-600', '#0891B2');
      root.style.setProperty('--color-cyan-950', '#083344');
    }
  }, [theme, tokens]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem('arise_theme', newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        tokens,
        themeName: THEME_DEFINITIONS[theme]?.name || 'Tactical Cyber'
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
