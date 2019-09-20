import * as React from "react";
import styled from "@emotion/styled";
import {colors} from "../../colors";
import {useDocsData, useReroute} from "../../hooks";
import useRouter from "use-react-router";

const StyledContainer = styled.div({
  display: 'flex'
});

const Title = styled.div({
  color: colors.primaryColor,
  fontSize: '5em',
  fontWeight: 900,
  textTransform: 'uppercase',
  // fontFamily: 'apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
});

const SubTitle = styled.div({
  color: colors.textColor,
  fontSize: '1.4em',
  fontWeight: 600,
  fontStyle: 'italic'
  // textTransform: 'uppercase'
});

const NavBarLinksContainer = styled.div({
  textAlign: 'right',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  flexGrow: 1
});

const NavBarLink = styled.a<{
  isActive: boolean
}>(props => ({
  display: 'inline-block',
  padding: '.8em .8em .4em .8em',
  fontSize: '1.4em',
  fontWeight: 900,
  textTransform: 'uppercase',
  cursor: !props.isActive ? 'pointer' : 'default',
  borderBottom: `.4em solid ${!props.isActive ? 'transparent' : colors.primaryColor}`,
  color: props.isActive ? colors.primaryColor : colors.textColor,

  ':hover': {
    backgroundColor: !props.isActive ? colors.primaryColor : 'transparent'
  },
  ':active': {
    backgroundColor: !props.isActive ? 'white' : 'transparent',
    color: colors.primaryColor
  }
}));

export const NavBar: React.FC = props => {
  const reroute = useReroute();
  const router = useRouter();
  const docs = useDocsData();

  return (
    <div>
      <StyledContainer>
        <Title>Hexogon</Title>

        <NavBarLinksContainer>
          {
            docs.nav.map(navLink => (
              <NavBarLink
                key={navLink.reference}
                onClick={() => reroute(`/${navLink.route}`)}
                isActive={router.location.pathname.startsWith(`/${navLink.reference}`)}
              >
                { navLink.title }
              </NavBarLink>
            ))
          }
        </NavBarLinksContainer>
      </StyledContainer>
      <SubTitle>A powerful and unopinionated Hexagon library for the web.</SubTitle>
    </div>
  );
};