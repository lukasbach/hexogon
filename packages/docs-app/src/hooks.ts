import {useContext, useEffect, useState} from "react";
import useReactRouter from "use-react-router";
import {ReferenceDataContext} from "./ReferenceDataContext";

export const useUrlParam = (parameterName: string) => {
  const { match } = useReactRouter();

  if (Object.keys(match.params).includes(parameterName)) {
    return (match.params as any)[parameterName];
  } else {
    return '';
  }
};

export const useReroute = () => {
  const { history } = useReactRouter();
  return (url: string) => history.push(url);
};

export const useVariable = <K>(effect: (() => Promise<K> | K), initial: K, deps: any[]): [K, (val: K) => void, () => void] => {
  const [get, set] = useState<K>(initial);
  const update = () => Promise.resolve(effect()).then(result => set(result));
  useEffect(() => { update(); }, ...deps);
  return [get, set, update];
};

export const useDocsData = () => {
  return useContext(ReferenceDataContext);
};
