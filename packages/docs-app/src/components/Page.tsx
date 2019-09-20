import * as React from "react";
import styled from "@emotion/styled";
import {NavBar} from "./common/NavBar";
import {LeftBar} from "./common/LeftBar";
import {PageContent} from "./common/PageContent";
import {HtmlStyledContainer} from "./common/ui";

const PageOuterContainer = styled.div({
  display: 'flex',
  height: '100%'
});

const MainContainer = styled.div<{
  leftBar: boolean
}>(props => ({
  flexGrow: 1,
  padding: '20px 80px',
  overflowY: 'auto'
}));

export const Page: React.FC<{
  leftBar?: React.ReactNode
}> = props => (
  <PageOuterContainer>
    { props.leftBar }
    <MainContainer leftBar={!!props.leftBar}>
      <NavBar />
      <PageContent>
        <HtmlStyledContainer>
          {props.children}
        </HtmlStyledContainer>
      </PageContent>
    </MainContainer>
  </PageOuterContainer>
);