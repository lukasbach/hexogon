import * as React from "react";
import styled from "@emotion/styled";
import {Page} from "../Page";
import {ReferenceMenu} from "./ReferenceMenu";
import {useDocsData, useReroute, useUrlParam} from "../../hooks";
import {orderReference} from "../../orderReferenceData";
import {SymbolLink} from "../common/ui";
import {LeftBar, LeftBarHeader, LeftBarItem} from "../common/LeftBar";
import {Example} from "../common/Example";

const StyledContainer = styled.div({});


export const MarkdownPage: React.FC<{
  pageReference: string;
}> = props => {
  const docs = useDocsData();
  const reroute = useReroute();
  const page = docs.pages[props.pageReference];
  const rootReference = page.route.split('/')[0];
  const rootPage = docs.pages[rootReference];
  const nav = docs.nav.find(n => n.reference === rootReference)!;

  return (
      <Page leftBar={nav.children && nav.children.length > 0 && (
        <LeftBar>
          <LeftBarHeader onClick={() => reroute(`/${rootReference}`)}>
            { rootPage.title }
          </LeftBarHeader>
          {
            nav.children.map(child => (
              <LeftBarItem
                onClick={() => reroute(`/${child.route}`)}
                active={child.route.endsWith(props.pageReference)}
              >
                { child.title }
              </LeftBarItem>
            ))
          }
        </LeftBar>
      )}>
        {
          page.contents.map(contentPart => {
            if (typeof contentPart === 'string') {
              return <div dangerouslySetInnerHTML={{__html: contentPart}} />;
            } else {
              switch (contentPart.tag) {
                case 'example':
                  return <Example exampleId={contentPart.value}/>;
                case 'interface':
                  return 'Inline Interface. TODO';
                case 'page':
                  return null;
                default:
                  throw Error(`Unknown tag: ${contentPart.tag}`);
              }
            }
          })
        }
      </Page>
  );
};