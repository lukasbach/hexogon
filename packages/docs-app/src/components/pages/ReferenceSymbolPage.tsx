import * as React from "react";
import styled from "@emotion/styled";
import {Page} from "../Page";
import {ReferenceMenu} from "./ReferenceMenu";
import {SubtleCard, SubtleCardContent, SubtleCardTitle} from "../common/SubtleCard";
import {useDocsData, useReroute, useUrlParam} from "../../hooks";
import {SymbolLink, Tag} from "../common/ui";
import {ITsClass, ITsEnum, ITsFlags, ITsInterface, ITsTypeAlias} from "@documentalist/client";
import {colors} from "../../colors";

const StyledContainer = styled.div({});

const MethodSignature = styled.pre({
  fontSize: '1.2em'
});
const MethodSignatureKeyword = styled.span({
  fontWeight: 600,
  color: colors.primaryColor,
  cursor: 'pointer',

  ':hover': {
    backgroundColor: colors.primaryColor,
    color: colors.bgColor
  },
  ':active': {
    backgroundColor: colors.textColor,
    color: colors.bgColor
  }
});
const SymbolFootNote = styled.span({
  fontSize: '.7em'
});

const SymbolIndex: React.FC<{
  title: string;
  symbols?: string[];
}> = props => {
  const reroute = useReroute();
  
  return (
    <>
      {
        props.symbols && props.symbols.length > 0 && (
        <>
          <h2>{props.title}</h2>
          {
            props.symbols.map(s => (
              <a href={`#${s}`}>
                <SymbolLink key={s}>
                  {s}
                </SymbolLink>
              </a>
            ))
          }
        </>
        )
      }
    </>
  );
};

const Flags: React.FC<{ flags: ITsFlags }> = props => (
  <>
    { props.flags.isDeprecated && <Tag>Deprecated</Tag> }
    { props.flags.isExternal && <Tag>External</Tag> }
    { props.flags.isOptional && <Tag>Optional</Tag> }
    { props.flags.isPrivate && <Tag>Private</Tag> }
    { props.flags.isProtected && <Tag>Protected</Tag> }
    { props.flags.isPublic && <Tag>Public</Tag> }
    { props.flags.isRest && <Tag>Rest</Tag> }
    { props.flags.isStatic && <Tag>Static</Tag> }
  </>
)

export const ReferenceSymbolPage: React.FC<{}> = props => {
  const docs = useDocsData();
  const symbol = useUrlParam('symbol');
  const symbolDocs: ITsClass | ITsInterface | ITsEnum | ITsTypeAlias = docs.typescript[symbol];
  const symbolDocsAsClass = symbolDocs as ITsClass;
  const symbolDocsAsInterface = symbolDocs as ITsInterface;
  const symbolDocsAsEnum = symbolDocs as ITsEnum;
  const symbolDocsAsTypeAlias = symbolDocs as ITsTypeAlias;

  return (
    <Page leftBar={<ReferenceMenu />}>
      <StyledContainer>
        <h1>
          {symbolDocs.name}
          <Flags flags={symbolDocs.flags!}/>
        </h1>

        <SymbolIndex
          title={'Methods'}
          symbols={symbolDocsAsClass.methods
          && symbolDocsAsClass.methods.map(p => p.name)}
        />

        <SymbolIndex
          title={'Properties'}
          symbols={symbolDocsAsClass.properties
            && symbolDocsAsClass.properties.map(p => p.name)}
        />

        <SymbolIndex
          title={'Enum Members'}
          symbols={symbolDocsAsEnum.members
          && symbolDocsAsEnum.members.map(p => p.name)}
        />

        {
          symbolDocsAsClass.methods && (
            <>
              <h1>Methods</h1>
              {
                symbolDocsAsClass.methods.map(method => (
                  <SubtleCard id={method.name}>
                    <SubtleCardTitle>
                      {method.name}
                      <Flags flags={method.flags!} />
                    </SubtleCardTitle>
                    <SubtleCardContent>
                      { method.signatures.map(sig => (
                        <>
                          <MethodSignature key={sig.type}>
                            ({sig.parameters.map(p =>
                              <MethodSignatureKeyword key={p.type}>{p.name}</MethodSignatureKeyword>)})
                            {' '}=>{' '}
                            <MethodSignatureKeyword>{ sig.returnType }</MethodSignatureKeyword>
                          </MethodSignature>
                          <div dangerouslySetInnerHTML={{__html: sig.documentation ? sig.documentation.contents.join('') : ''}} />
                        </>
                      )) }

                      <div dangerouslySetInnerHTML={{__html: method.documentation ? method.documentation.contents.join('') : ''}} />

                      <SymbolFootNote>
                        { method.inheritedFrom && `Inherited from ${method.inheritedFrom}.` }<br />
                        Defined in {method.fileName}.
                      </SymbolFootNote>
                    </SubtleCardContent>
                  </SubtleCard>
                ))
              }
            </>
          )
        }
      </StyledContainer>
    </Page>
  );
};