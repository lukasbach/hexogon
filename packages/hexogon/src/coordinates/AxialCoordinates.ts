import {ICoordinates} from "./Coordinates";
import {OffsetCoordinatesType} from "../options/OffsetCoordinatesType";
import {Orientation} from "../options/Orientation";
import {CubeCoordinates} from "./CubeCoordinates";
import {OffsetCoordinates} from "./OffsetCoordinates";
import {CoordinateConversion} from "./CoordinateConversion";

export class AxialCoordinates implements ICoordinates {
  get q() {
    return this._q;
  }
  get r() {
    return this._r;
  }

  public constructor(private _q: number, private _r: number) {}

  equal(coords: ICoordinates): boolean {
    const c = coords.toAxialCoordinates();
    return c.q === this.q && c.r === this.r;
  }

  toAxialCoordinates(): AxialCoordinates {
    return this;
  }

  toCubeCoordinates(): CubeCoordinates {
    return CoordinateConversion.axialToCube(this);
  }

  toOffsetCoordinates(type: OffsetCoordinatesType, orientation: Orientation): OffsetCoordinates {
    return this.toCubeCoordinates().toOffsetCoordinates(type, orientation);
  }

  clone(): ICoordinates {
    return new AxialCoordinates(this.q, this.r);
  }

  toArray(): [number, number] {
    return [this.q, this.r];
  }

  toId(): string {
    return this.toCubeCoordinates().toId();
  }
}
