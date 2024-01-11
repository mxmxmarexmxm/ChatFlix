import React, { useEffect, useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Copy } from '../../assets/icons/Copy';
import { Expand } from '../../assets/icons/Expand';
import classes from './CodeSnippet.module.css';
import { CopySuccess } from '../../assets/icons/CopySuccess';
import { useModal } from '../../context/ModalContext';
import { useSettingsContext } from '../../context/SettingsContext';

const CodeSnippet = ({ code, language, settingsTheme }) => {
  const [successfulCopy, setSuccessfulCopy] = useState(false);
  const { settings } = useSettingsContext();
  const { openModal } = useModal();

  useEffect(() => {
    if (successfulCopy) {
      setTimeout(() => setSuccessfulCopy(false), 3000);
    }
  }, [successfulCopy]);

  const handleClipboardCopy = () => {
    setSuccessfulCopy(true);
    navigator.clipboard.writeText(code);
  };

  return (
    <div className={classes['code-snippet']}>
      {!settingsTheme && (
        <div className={classes['buttons-wrapper']}>
          <button
            className={classes['expand-btn']}
            onClick={() =>
              openModal(<CodeSnippet code={code} />, 'Code Preview')
            }
          >
            <Expand />
          </button>
          <button
            className={`${
              successfulCopy ? classes['successful-copy-btn'] : ''
            }`}
            onClick={handleClipboardCopy}
          >
            {successfulCopy ? <CopySuccess /> : <Copy />}
          </button>
        </div>
      )}
      <Highlight
        theme={
          settingsTheme ? themes[settingsTheme] : themes[settings.codeTheme]
        }
        code={code}
        language={language || 'javascript'}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default CodeSnippet;
