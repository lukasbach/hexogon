import {CoordinateLazyParameter, ICoordinates} from './Coordinates';
import {AxialCoordinates} from "./AxialCoordinates";
import {OffsetCoordinatesType} from "../options/OffsetCoordinatesType";
import {Orientation} from "../options/Orientation";
import {OffsetCoordinates} from "./OffsetCoordinates";
import {CoordinateConversion} from "./CoordinateConversion";
import {LazyCoordinateConstructor} from "./LazyCoordinateConstructor";
import {VerticalRelativePosition} from "../options/VerticalRelativePosition";
import {HorizontalRelativePosition} from "../options/HorizontalRelativePosition";
import {PixelPosition} from "../PixelPosition";
import {Utils} from "../Utils";

export class CubeCoordinates implements ICoordinates {
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  get z() {
    return this._z;
  }

  public constructor(private _x: number, private _y: number, private _z: number) {}

  equal(coords: ICoordinates): boolean {
    const c = coords.toCubeCoordinates();
    return c.x === this.x && c.y === this.y && c.z === this.z;
  }

  toAxialCoordinates(): AxialCoordinates {
    return CoordinateConversion.cubeToAxial(this);
  }

  toCubeCoordinates(): CubeCoordinates {
    return this;
  }

  clone(): ICoordinates {
    return new CubeCoordinates(this.x, this.y, this.z);
  }

  toOffsetCoordinates(type: OffsetCoordinatesType, orientation: Orientation): OffsetCoordinates {
    if (type === OffsetCoordinatesType.Even) {
      if (orientation === Orientation.Flat) {
        return CoordinateConversion.cubeToOffsetEvenFlat(this);
      } else if (orientation === Orientation.Pointy) {
        return CoordinateConversion.cubeToOffsetEvenPointy(this);
      } else {
        throw Error(`Invalid offset coordinates orientation: ${orientation}`);
      }
    } else if (type === OffsetCoordinatesType.Odd) {
      if (orientation === Orientation.Flat) {
        return CoordinateConversion.cubeToOffsetOddFlat(this);
      } else if (orientation === Orientation.Pointy) {
        return CoordinateConversion.cubeToOffsetOddPointy(this);
      } else {
        throw Error(`Invalid offset coordinates orientation: ${orientation}`);
      }
    } else {
      throw Error(`Invalid offset coordinates type: ${type}`);
    }
  }

  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  toString() {
    return `c[${this.x},${this.y},${this.z}]`;
  }

  add(coords: CoordinateLazyParameter): CubeCoordinates {
    const cube = LazyCoordinateConstructor.lazyConstruct(coords).toCubeCoordinates();
    this._x += cube.x;
    this._y += cube.y;
    this._z += cube.z;
    return this;
  }

  subtract(coords: CoordinateLazyParameter): CubeCoordinates {
    const cube = LazyCoordinateConstructor.lazyConstruct(coords).toCubeCoordinates();
    this._x -= cube.x;
    this._y -= cube.y;
    this._z -= cube.z;
    return this;
  }

  multiply(n: number) {
    this._x *= n;
    this._y *= n;
    this._z *= n;
    return this;
  }

  round() {
    let x = Math.round(this._x);
    let y = Math.round(this._y);
    let z = Math.round(this._z);

    const xDiff = Math.abs(x - this._x);
    const yDiff = Math.abs(y - this._y);
    const zDiff = Math.abs(z - this._z);

    if (xDiff > yDiff && xDiff > zDiff) {
      x = -y - z;
    } else if (yDiff > zDiff) {
      y = -x - z;
    } else {
      z = -x - y;
    }

    this._x = x;
    this._y = y;
    this._z = z;

    return this;
  }

  addEps() {
    this._x += 1e-6;
    this._y += 2e-6;
    this._z += -3e-6;
    return this;
  }

  rotateRightAroundZero() {
    const [x, y, z] = [this._x, this._y, this._z];
    this._x = -z;
    this._y = -x;
    this._z = -y;
    return this;
  }

  rotateLeftAroundZero() {
    const [x, y, z] = [this._x, this._y, this._z];
    this._x = -y;
    this._y = -z;
    this._z = -x;
    return this;
  }

  rotateRight(reference: ICoordinates) {
    this.subtract(reference);
    this.rotateRightAroundZero();
    this.add(reference);
    return this;
  }

  rotateLeft(reference: ICoordinates) {
    this.subtract(reference);
    this.rotateLeftAroundZero();
    this.add(reference);
    return this;
  }

  public distanceTo(coords: CubeCoordinates) {
    return Math.max(
      Math.abs(this._x - coords.x),
      Math.abs(this._y - coords.y),
      Math.abs(this._z - coords.z),
    );
  }

  getVerticalRelativePosition(toCoords: ICoordinates, orientation: Orientation): VerticalRelativePosition {
    return this.getCenterPixelPosition(orientation, 5, 0)
      .getVerticalRelativePosition(toCoords.toCubeCoordinates().getCenterPixelPosition(orientation, 5));

    /*const cube = toCoords.toCubeCoordinates();
    if (orientation === Orientation.Pointy) {
      return cube.z < this.z ? VerticalRelativePosition.Above : cube.z === this.z
        ? VerticalRelativePosition.Same : VerticalRelativePosition.Below;
    } else {
      // TODO
    }*/
  }

  getHorizontalRelativePosition(toCoords: ICoordinates, orientation: Orientation): HorizontalRelativePosition {
    return this.getCenterPixelPosition(orientation, 5, 0)
      .getHorizontalRelativePosition(toCoords.toCubeCoordinates().getCenterPixelPosition(orientation, 5));
    /*const cube = toCoords.toCubeCoordinates();
    if (orientation === Orientation.Pointy) {
      // TODO
    } else {
      return cube.x < this.x ? HorizontalRelativePosition.Left : cube.x === this.x
        ? HorizontalRelativePosition.Same : HorizontalRelativePosition.Right;
    }*/
  }

  getCenterPixelPosition(orientation: Orientation, size: number, spacing: number = 0): PixelPosition {
    switch (orientation) {
      case Orientation.Flat:
        return new PixelPosition(
          size * (3/2 * this.x),
          size * (Utils.Sqrt3 / 2 * this.x + Utils.Sqrt3 * this.y),
        )
          .add(new PixelPosition(this.x, this.y).multiply(spacing));
      case Orientation.Pointy:
        return new PixelPosition(
          size * (Utils.Sqrt3 * this.x + Utils.Sqrt3/2 * this.y),
          size * (3/2 * this.y),
        )
          .add(new PixelPosition(this.x, this.y).multiply(spacing));
    }
  }

  toId(): string {
    return `hexogon-cc-${this.x}-${this.y}-${this.z}`;
  }
}
