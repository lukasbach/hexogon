import {ICoordinates} from "./coordinates/Coordinates";
import {CubeCoordinates} from "./coordinates/CubeCoordinates";

export class LineDrawingInterpolation {
  static lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  static cubeLerp(a: CubeCoordinates, b: CubeCoordinates, t: number) {
    return new CubeCoordinates(
      this.lerp(a.x, b.x, t),
      this.lerp(a.y, b.y, t),
      this.lerp(a.z, b.z, t)
    );
  }

  static draw(from: ICoordinates, to: ICoordinates) {
    const fromCube = from.toCubeCoordinates();
    const toCube = to.toCubeCoordinates();

    const amountOfHexsInbetween = fromCube.distanceTo(toCube);

    const results: ICoordinates[] = [];

    for (let i = 0; i < amountOfHexsInbetween; i++) {
      results.push(this.cubeLerp(fromCube, toCube, 1/amountOfHexsInbetween * i).addEps().round());
    }

    return results;
  }
}