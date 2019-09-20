import * as React from "react";
import styled from "@emotion/styled";
import {useEffect, useRef, useState} from "react";
import * as examples from 'hexogon-docs-examples';

const StyledContainer = styled.div({});

export const Example: React.FC<{
  exampleId: string
}> = props => {
  const [code, setCode] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      setCode(await (await fetch(`/examples/${props.exampleId}.ts`)).text());
    })();

    const example = (examples as any)[props.exampleId];
    const out = example();
    outputRef.current!.appendChild(out);
  }, []);

  return (
    <StyledContainer>
      <pre>
        { code }
      </pre>
      <div ref={outputRef} />
    </StyledContainer>
  );
};