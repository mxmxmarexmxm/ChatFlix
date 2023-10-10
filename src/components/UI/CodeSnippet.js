import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';

const CodeSnippet = ({ code, language }) => {
  return (
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
  );
};

export default CodeSnippet;
