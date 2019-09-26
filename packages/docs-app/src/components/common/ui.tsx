import styled from "@emotion/styled";
import {colors} from "../../colors";

export const htmlStyles = {
  h1: {
    color: colors.primaryColor,
    borderBottom: `4px solid ${colors.primaryColor}`,
    fontSize: '2em',
    fontWeight: 900,
    textTransform: 'uppercase',
    width: '100%',
    marginTop: '1.6em'
  },
  h2: {
    color: colors.primaryColor,
    fontSize: '1.6em',
    fontWeight: 900,
    textTransform: 'uppercase',
    width: '100%'
  }
};

// export const H1 = styled.h1(htmlStyles.h1.);
// export const H2 = styled.h2(htmlStyles.h2);


export const HtmlStyledContainer = styled.div({
  h1: {
    color: colors.primaryColor,
    borderBottom: `4px solid ${colors.primaryColor}`,
    fontSize: '2em',
    fontWeight: 900,
    textTransform: 'uppercase',
    width: '100%',
    marginTop: '1.6em',
  },
  h2: {
    color: colors.primaryColor,
    fontSize: '1.6em',
    fontWeight: 900,
    textTransform: 'uppercase',
    width: '100%',
  },
});

export const Tag = styled.div({
  display: 'inline-block',
  backgroundColor: colors.primaryColor,
  color: colors.bgColor,
  fontSize: '16px',
  fontWeight: 900,
  textTransform: 'uppercase',
  margin: '0 0 0 20px',
  padding: '3px 6px',
  verticalAlign: 'middle'
});

export const SymbolLink = styled.div({
  display: 'inline-block',
  width: '200px',
  fontSize: '16px',
  fontWeight: 700,
  // textTransform: 'uppercase',
  border: `3px solid ${colors.textColor}`,
  backgroundColor: colors.bgColor,
  color: colors.textColor,
  margin: '4px 20px 8px 0',
  padding: '10px 14px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',

  ':hover': {
    backgroundColor: colors.primaryColor,
    borderColor: colors.primaryColor,
    color: colors.bgColor
  },
  ':active': {
    backgroundColor: colors.textColor,
    borderColor: colors.textColor,
    color: colors.primaryColor
  }
});