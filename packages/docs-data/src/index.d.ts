import { INpmPluginData, IMarkdownPluginData, ITypescriptPluginData } from "@documentalist/client";

export type IDocsCompleteData = IMarkdownPluginData & INpmPluginData & ITypescriptPluginData;

export const docsData: IDocsCompleteData;