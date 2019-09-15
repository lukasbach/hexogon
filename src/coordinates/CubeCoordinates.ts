import {CoordinateLazyParameter, ICoordinates} from './Coordinates';
import {AxialCoordinates} from "./AxialCoordinates";
import {OffsetCoordinatesType} from "../options/OffsetCoordinatesType";
import {Orientation} from "../options/Orientation";
import {OffsetCoordinates} from "./OffsetCoordinates";
import {CoordinateConversion} from "./CoordinateConversion";
import instantiate = WebAssembly.instantiate;
import {LazyCoordinateConstructor} from "./LazyCoordinateConstructor";
import {Hexogon} from "../Hexogon";

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
}
