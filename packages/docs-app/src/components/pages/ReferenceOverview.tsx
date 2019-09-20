import * as React from "react";
import styled from "@emotion/styled";
import {Page} from "../Page";
import {ReferenceMenu} from "./ReferenceMenu";
import {useDocsData, useReroute} from "../../hooks";
import {orderReference} from "../../orderReferenceData";
import {SymbolLink} from "../common/ui";

const StyledContainer = styled.div({});


export const ReferenceOverview: React.FC<{}> = props => {
  const docs = useDocsData();
  const orderedReference = orderReference(docs);
  const reroute = useReroute();

  return (
      <Page>
        <h1>Classes</h1>
        {
          Object.keys(orderedReference.classes).map(symbolName => (
            <SymbolLink onClick={() => reroute(`/reference/${symbolName}`)}>
              { symbolName }
            </SymbolLink>
          ))
        }

        <h1>Interfaces</h1>
        {
          Object.keys(orderedReference.interfaces).map(symbolName => (
            <SymbolLink onClick={() => reroute(`/reference/${symbolName}`)}>
              { symbolName }
            </SymbolLink>
          ))
        }

        <h1>Enums</h1>
        {
          Object.keys(orderedReference.enums).map(symbolName => (
            <SymbolLink onClick={() => reroute(`/reference/${symbolName}`)}>
              { symbolName }
            </SymbolLink>
          ))
        }

        <h1>Type Aliases</h1>
        {
          Object.keys(orderedReference.typeAliases).map(symbolName => (
            <SymbolLink onClick={() => reroute(`/reference/${symbolName}`)}>
              { symbolName }
            </SymbolLink>
          ))
        }
      </Page>
  );
};