import {GridStorage} from "./GridStorage";
import {Hexogon} from "../Hexogon";
import {ICoordinates} from "../coordinates/Coordinates";

export class SparseGridStorage<Payload extends {}> extends GridStorage<Payload> {
  private storage: Hexogon<Payload>[] = [];

  getAll(): Hexogon<Payload>[] {
    return this.storage;
  }

  getAt(coords: ICoordinates): Hexogon<Payload> | undefined {
    return this.storage.find(hex => hex.isAt(coords));
  }

  store(...hex: Hexogon<Payload>[]): void {
    this.storage.push(...hex);
  }

  removeAt(coords: ICoordinates): boolean {
    const index = this.getHexogonIndex(coords);

    if (index) {
      this.storage.splice(index, 1);
      return true;
    } else {
      return false;
    }
  }

  private getHexogonIndex(coords: ICoordinates): number | undefined {
    for (let i = 0; i < this.storage.length; i++) {
      if (this.storage[i].coordinates.equal(coords)) {
        return i;
      }
    }

    return undefined;
  }
}