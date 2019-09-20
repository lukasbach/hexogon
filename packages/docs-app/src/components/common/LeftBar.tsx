import * as React from "react";
import styled from "@emotion/styled";
import {colors} from "../../colors";

const StyledContainer = styled.div({
  minWidth: '240px',
  backgroundColor: colors.primaryColor,
  padding: '1em 0',
  overflowY: 'auto',
});

export const LeftBarHeader = styled.div({
  fontSize: '1.6em',
  fontWeight: 800,
  padding: '40px 20px 10px 20px',
  color: colors.bgColor,
  textTransform: 'uppercase',
  cursor: 'pointer',

  ':hover': {
    color: colors.textColor
  }
});

export const LeftBarItem = styled.div<{ active: boolean }>(props => ({
  fontSize: '1em',
  fontWeight: 800,
  padding: '4px 10px',
  color: props.active ? colors.textColor : colors.bgColor,
  cursor: 'pointer',
  borderLeft: `12px solid ${props.active ? colors.textColor : 'transparent'}`,
  whiteSpace: 'nowrap',
  overflowX: 'hidden',
  textOverflow: 'ellipsis',

  ':hover': {
    backgroundColor: colors.textColor,
    color: colors.primaryColor
  }
}));

export const LeftBar: React.FC<{}> = props => (
  <StyledContainer className={'scroll-textColor'}>
    { props.children }
  </StyledContainer>
);