import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box } from '@mui/system';
import { DarkTheme, LightTheme } from '../themes';
import '../global.module.scss';

interface IThemeContextData {
  themeName: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext({} as IThemeContextData);

export const useAppThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppThemeContext must be used within an AppThemeProvider');
  }
  return context;
};

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<'light' | 'dark'>(() => {
    // Verificar se existe um tema salvo no localStorage
    const savedTheme = localStorage.getItem('appTheme');
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
  });

  const toggleTheme = useCallback(() => {
    setThemeName((oldThemeName) => {
      const newThemeName = oldThemeName === 'light' ? 'dark' : 'light';
      localStorage.setItem('appTheme', newThemeName); // Salvar a preferência no localStorage
      return newThemeName;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('appTheme', themeName); // Salvar a preferência ao carregar o componente
  }, [themeName]);

  const theme = useMemo(() => {
    return themeName === 'light' ? LightTheme : DarkTheme;
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            transition: 'background-color 0.3s ease-in-out',
          }}
          className={themeName === 'light' ? 'light-mode' : 'dark-mode'}
        >
          {children}
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
