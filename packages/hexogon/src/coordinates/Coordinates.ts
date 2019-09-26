import {Orientation} from "../options/Orientation";
import {CubeCoordinates} from "./CubeCoordinates";
import {AxialCoordinates} from "./AxialCoordinates";
import {OffsetCoordinates} from "./OffsetCoordinates";
import {OffsetCoordinatesType} from "../options/OffsetCoordinatesType";

export type CoordinateLazyParameter = string | number[] | {x: number, y: number} | {x: number, y: number, z: number} | ICoordinates;

export interface ICoordinates {
  toCubeCoordinates(): CubeCoordinates;
  toAxialCoordinates(): AxialCoordinates;
  toOffsetCoordinates(type: OffsetCoordinatesType, orientation: Orientation): OffsetCoordinates;
  equal(coords: ICoordinates): boolean;
  clone(): ICoordinates;
  toId(): string;
}
