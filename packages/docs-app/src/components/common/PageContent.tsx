import * as React from "react";
import styled from "@emotion/styled";

const StyledContainer = styled.div({

});

const ContentContainer = styled.div({
  display: 'flex',

});

export const PageContent: React.FC<{}> = props => (
  <StyledContainer>
    {props.children}
  </StyledContainer>
);