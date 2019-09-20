import {ITsClass, ITsEnum, ITsInterface, ITsTypeAlias, ITypescriptPluginData, Kind} from "@documentalist/client";

const filterRefData = (data: ITypescriptPluginData, predicate: (val: ITsClass | ITsInterface | ITsEnum | ITsTypeAlias) => boolean) =>
  Object.keys(data.typescript)
    .filter(key => predicate(data.typescript[key]))
    .reduce((res, key) => ({ ...res, [key]: data.typescript[key] }), {});

export const orderReference = (docsData: ITypescriptPluginData) => ({
  interfaces: filterRefData(docsData, o => o.kind === Kind.Interface),
  classes: filterRefData(docsData, o => o.kind === Kind.Class),
  enums: filterRefData(docsData, o => o.kind === Kind.Enum),
  typeAliases: filterRefData(docsData, o => o.kind === Kind.TypeAlias),
});
