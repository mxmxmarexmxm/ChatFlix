import React, { useState } from 'react';
import CodeSnippet from './CodeSnippet';
import classes from './CodeThemeSettings.module.css';
import { useSettingsContext } from '../../context/SettingsContext';

const themes = [
  'dracula',
  'vsDark',
  'vsLight',
  'nightOwl',
  'nightOwlLight',
  'duotoneDark',
  'duotoneLight',
  'github',
  'jettwaveDark',
  'jettwaveLight',
  'oceanicNext',
  'okaidia',
  'oneDark',
  'oneLight',
  'palenight',
  'shadesOfPurple',
  'synthwave84',
  'ultramin',
];

const CodeSettings = () => {
  const { settings, setSettings } = useSettingsContext();

  const [selectedTheme, setSelectedTheme] = useState(
    settings.codeTheme || 'vsDark'
  );

  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    setSettings((currSettings) => {
      return {
        ...currSettings,
        codeTheme: theme,
      };
    });
  };

  return (
    // TODO: IMROVE UI ! 
    <div className={classes['code-container']}>
      {themes.map((theme) => (
        <div key={theme} className={classes['code-theme']}>
          <div>
            <input
              type="radio"
              id={theme}
              name="code-theme"
              value={theme}
              checked={selectedTheme === theme}
              onChange={() => handleThemeChange(theme)}
            />
            <label htmlFor={theme}>{theme}</label>
          </div>
          <CodeSnippet
            code="<h1>Hello World!</h1>"
            settingsTheme={theme}
            isSettings
          />
        </div>
      ))}
    </div>
  );
};

export default CodeSettings;
