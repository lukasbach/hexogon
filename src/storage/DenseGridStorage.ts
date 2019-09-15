import {GridStorage} from "./GridStorage";
import {ICoordinates} from "../coordinates/Coordinates";
import {Hexogon} from "../Hexogon";

export class DenseGridStorage<Payload extends object = {}> extends GridStorage<Payload> {
  private storage: Hexogon<Payload>[][] = [];

  getAll(): Hexogon<Payload>[] {
    return [];
  }

  getAt(coords: ICoordinates): Hexogon<Payload> | undefined {
    return undefined;
  }

  removeAt(coords: ICoordinates): boolean {
    return false;
  }

  store(...hex: Hexogon<Payload>[]): void {
  }
}
