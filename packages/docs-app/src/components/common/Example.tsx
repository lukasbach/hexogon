import * as React from "react";
import styled from "@emotion/styled";
import {useEffect, useRef, useState} from "react";
import * as examples from 'hexogon-docs-examples';
import {colors} from "../../colors";

const StyledContainer = styled.div({
  display: 'flex',
  width: '100%',
  maxHeight: '600px'
});
const CodeContainer = styled.div({
  borderTop: `4px solid ${colors.textColor}`,
  borderLeft: `4px solid ${colors.textColor}`,
  borderBottom: `4px solid ${colors.textColor}`,
  padding: '.2em 1.6em',
  flexGrow: 1,
  overflow: 'auto',
  position: 'relative'
});
const ExampleOutput = styled.div({
  width: '600px',
  backgroundColor: colors.textColor,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center'
});
const SourceButton = styled.div({
  position: 'absolute',
  top: 0,
  right: 0,
  backgroundColor: colors.textColor,
  color: colors.bgColor,
  padding: '.3em .6em',
  fontWeight: 800,
  cursor: 'pointer',
  
  ':hover': {
    color: colors.primaryColor
  }
});

export const Example: React.FC<{
  exampleId: string
}> = props => {
  const [code, setCode] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const result = (await (await fetch(`/examples/${props.exampleId}.ts`)).text()).split('\n');

      while (result[0].startsWith('import ') || result[0] === '' || result[0] === '\r') {
        result.splice(0, 1);
      }

      setCode(result.join('\n'));
    })();

    const example = (examples as any)[props.exampleId];
    const out = example();
    outputRef.current!.appendChild(out);
  }, []);

  useEffect(() => (window as any).Prism.highlightAll(), [code]);

  return (
    <StyledContainer>
      <CodeContainer>
        <pre>
          <code className={'language-typescript'}>
            { code }
          </code>
        </pre>
        <SourceButton>GitHub</SourceButton>
      </CodeContainer>
      <ExampleOutput ref={outputRef} />
    </StyledContainer>
  );
};