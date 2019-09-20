import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {ReferenceSymbolPage} from "./pages/ReferenceSymbolPage";
import {ReferenceOverview} from "./pages/ReferenceOverview";
import {useDocsData} from "../hooks";
import {MarkdownPage} from "./pages/MarkdownPage";
import {IHeadingNode, IPageNode} from "@documentalist/client";

const isPageNode = (node: IPageNode | IHeadingNode): node is IPageNode => !!node.route;
const isHeadingNode = (node: IPageNode | IHeadingNode): node is IHeadingNode => !node.route;

const RenderRoutesForPage: React.FC<{ page: IPageNode | IHeadingNode }> = props => (
  <>
    {
      isPageNode(props.page) && (
        <Route
          key={props.page.reference}
          path={`/${props.page.route}`}
          exact={true}
          component={() => <MarkdownPage pageReference={(props.page as IPageNode).reference} />}
        />
      )
    }
    {
      isPageNode(props.page) && props.page.children.map(child => (
        <RenderRoutesForPage page={child}/>
      ))
    }
  </>
);

export const Routes: React.FC = props => {
  const docs = useDocsData();
  const navLinks = docs.nav.filter(n => n.reference !== 'reference');

  return (
    <div style={{ height: '100%' }}>
      <Route path={'/reference'} exact={true} component={ReferenceOverview} />
      <Route path={'/reference/:symbol'} component={ReferenceSymbolPage} />
      <Route path={'/'} exact={true} component={() => <MarkdownPage pageReference={docs.nav[0].reference} />} />

      {
        navLinks.map(navLink => (
          <RenderRoutesForPage page={navLink} />
        ))
      }
      {/*
        navLinks.map(navLink => (
          <Route
            key={navLink.reference}
            path={`/${navLink.route}`}
            exact={true}
            component={() => <MarkdownPage pageReference={navLink.reference} />}
          />
        ))
      */}
    </div>
  )
};
