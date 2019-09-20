import {ICoordinates} from "./Coordinates";
import {Hexogon} from "../Hexogon";

export class CoordinateUtils {
  public static getCoordsInRange(center: ICoordinates, range: number): ICoordinates[] {
    const results: ICoordinates[] = [];

    for (let x = -range; x <= range; x++) {
      for (let y = -range; y <= range; y++) {
        for (let z = -range; z <= range; z++) {
          if (x + y + z === 0) {
            results.push(center.clone().toCubeCoordinates().add([x, y, z]));
          }
        }
      }
    }

    return results;
  }
}
