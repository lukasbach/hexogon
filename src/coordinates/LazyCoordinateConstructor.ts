import {CoordinateLazyParameter, ICoordinates} from "./Coordinates";
import {CubeCoordinates} from "./CubeCoordinates";
import {AxialCoordinates} from "./AxialCoordinates";
import {OffsetCoordinates} from "./OffsetCoordinates";

export class LazyCoordinateConstructor {
  static lazyConstruct(parameter: CoordinateLazyParameter): ICoordinates {
    if (parameter instanceof CubeCoordinates || parameter instanceof AxialCoordinates
      || parameter instanceof OffsetCoordinates) {
      return parameter;
    }

    if (typeof parameter === "string") {
      const [x, y, z] = parameter.split(',').map(i => parseInt(i));
      return new CubeCoordinates(x, y, z);
    } else if (typeof parameter === "object") {
      if ((parameter as number[]).length !== undefined) {
        const [x, y, z] = parameter as number[];
        if (!z) {
          return new AxialCoordinates(x, y);
        }
        return new CubeCoordinates(x, y, z);
      } else {
        const {x, y, z} = parameter as {x: number, y: number, z: number};
        return new CubeCoordinates(x, y, z);
      }
    } else {
      throw Error(`Could not lazy construct cube coordinates from ${parameter}`);
    }
  }
}
