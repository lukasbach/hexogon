import {HexogonGrid} from "./HexogonGrid";
import {AbstractRenderer} from "./renderers/AbstractRenderer";

export type HexogonStateOf<T extends HexogonGrid | AbstractRenderer> =
  T extends HexogonGrid<infer X> ? X :
    T extends AbstractRenderer<infer X> ? X : never;
