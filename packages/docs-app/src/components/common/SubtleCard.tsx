import * as React from "react";
import styled from "@emotion/styled";
import {colors} from "../../colors";

export const SubtleCard = styled.div({
  margin: '1em 0'
});

export const SubtleCardTitle = styled.div({
  color: colors.bgColor,
  backgroundColor: colors.textColor,
  padding: '.4em .8em',
  fontSize: '1.2em',
  fontWeight: 900,
});

export const SubtleCardContent = styled.div({
  border: `4px solid ${colors.textColor}`,
  padding: '.4em .8em',
  color: colors.textColor,
});
