import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Copy } from '../../assets/icons/Copy';
import classes from './CodeSnippet.module.css';

const CodeSnippet = ({ code, language }) => {
  return (
    <div className={classes['code-snippet']}>
      <button
        className={classes['copy-btn']}
        onClick={() => navigator.clipboard.writeText(code)}
      >
        <Copy />
      </button>
      <Highlight
        theme={themes.vsDark}
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
