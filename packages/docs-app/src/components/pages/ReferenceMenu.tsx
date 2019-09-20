import * as React from "react";
import {LeftBar, LeftBarHeader, LeftBarItem} from "../common/LeftBar";
import {useDocsData, useReroute, useUrlParam} from "../../hooks";
import {orderReference} from "../../orderReferenceData";
import useRouter from "use-react-router";

const ReferenceMenuItem: React.FC<{
  symbol: string
}> = props => {
  const reroute = useReroute();
  const urlParam = useUrlParam('symbol');

  return (
    <LeftBarItem
      onClick={() => reroute(`/reference/${props.symbol}`)}
      active={urlParam === props.symbol}
    >
      {props.symbol}
    </LeftBarItem>
  )
};

export const ReferenceMenu: React.FC = () => {
  const docs = useDocsData();
  const orderedReference = orderReference(docs);

  return (
    <LeftBar>
      <LeftBarHeader>Classes</LeftBarHeader>
      {Object.keys(orderedReference.classes).map(k => <ReferenceMenuItem key={k} symbol={k} />)}

      <LeftBarHeader>Interfaces</LeftBarHeader>
      {Object.keys(orderedReference.interfaces).map(k => <ReferenceMenuItem key={k} symbol={k} />)}

      <LeftBarHeader>Enums</LeftBarHeader>
      {Object.keys(orderedReference.enums).map(k => <ReferenceMenuItem key={k} symbol={k} />)}

      <LeftBarHeader>Type Aliases</LeftBarHeader>
      {Object.keys(orderedReference.typeAliases).map(k => <ReferenceMenuItem key={k} symbol={k} />)}
    </LeftBar>
  )
};
