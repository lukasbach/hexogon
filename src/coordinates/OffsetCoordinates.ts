import {ICoordinates} from "./Coordinates";
import {AxialCoordinates} from "./AxialCoordinates";
import {OffsetCoordinatesType} from "../options/OffsetCoordinatesType";
import {Orientation} from "../options/Orientation";
import {CubeCoordinates} from "./CubeCoordinates";
import {CoordinateConversion} from "./CoordinateConversion";

export class OffsetCoordinates implements ICoordinates {
  get q() {
    return this._q;
  }
  get r() {
    return this._r;
  }

  public constructor(private _q: number, private _r: number, private _type: OffsetCoordinatesType, private _orientation: Orientation) {}

  equal(coords: ICoordinates): boolean {
    const c = coords.toOffsetCoordinates(this._type, this._orientation);
    return c.q === this.q && c.r === this.r;
  }

  toAxialCoordinates(): AxialCoordinates {
    return this.toCubeCoordinates().toAxialCoordinates();
  }

  toCubeCoordinates(): CubeCoordinates {
    if (this._type === OffsetCoordinatesType.Even) {
      if (this._orientation === Orientation.Flat) {
        return CoordinateConversion.offsetEvenFlatToCube(this);
      } else if (this._orientation === Orientation.Pointy) {
        return CoordinateConversion.offsetEvenPointyToCube(this);
      } else {
        throw Error(`Invalid offset coordinates orientation: ${this._orientation}`);
      }
    } else if (this._type === OffsetCoordinatesType.Odd) {
      if (this._orientation === Orientation.Flat) {
        return CoordinateConversion.offsetOddFlatToCube(this);
      } else if (this._orientation === Orientation.Pointy) {
        return CoordinateConversion.offsetOddPointyToCube(this);
      } else {
        throw Error(`Invalid offset coordinates orientation: ${this._orientation}`);
      }
    } else {
      throw Error(`Invalid offset coordinates type: ${this._type}`);
    }
  }

  toOffsetCoordinates(type: OffsetCoordinatesType, orientation: Orientation): OffsetCoordinates {
    return this;
  }

  clone(): ICoordinates {
    return new OffsetCoordinates(this.q, this.r, this._type, this._orientation);
  }

  toArray(): [number, number] {
    return [this.q, this.r];
  }
}
