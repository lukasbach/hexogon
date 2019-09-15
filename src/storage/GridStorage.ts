import {Hexogon} from "../Hexogon";
import {ICoordinates} from "../coordinates/Coordinates";

export abstract class GridStorage<Payload extends object = {}> {
  abstract getAll(): Hexogon<Payload>[];
  abstract getAt(coords: ICoordinates): Hexogon<Payload> | undefined;
  abstract store(...hex: Hexogon<Payload>[]): void;
  abstract removeAt(coords: ICoordinates): boolean;

  remove(hex: Hexogon<Payload>) {
    return this.removeAt(hex.coordinates);
  };
}