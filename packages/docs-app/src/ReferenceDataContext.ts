import * as React from "react";
import {IMarkdownPluginData, INpmPluginData, ITypescriptPluginData} from "@documentalist/client";
import docs from 'hexogon-docs-data';

export const ReferenceDataContext = React.createContext<IMarkdownPluginData & INpmPluginData & ITypescriptPluginData>(docs.docsData);