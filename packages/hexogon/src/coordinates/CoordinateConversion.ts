import {CubeCoordinates} from "./CubeCoordinates";
import {AxialCoordinates} from "./AxialCoordinates";
import {OffsetCoordinates} from "./OffsetCoordinates";
import {Utils} from "../Utils";
import {OffsetCoordinatesType} from "../options/OffsetCoordinatesType";
import {Orientation} from "../options/Orientation";

export class CoordinateConversion {
  public static cubeToAxial(cube: CubeCoordinates): AxialCoordinates {
    return new AxialCoordinates(cube.x, cube.y);
  }

  public static axialToCube(axial: AxialCoordinates): CubeCoordinates {
    return new CubeCoordinates(axial.q, axial.r, - axial.q - axial.r);
  }

  public static cubeToOffsetOddPointy(cube: CubeCoordinates): OffsetCoordinates {
    return new OffsetCoordinates(
      cube.x + (cube.z - (Utils.mod(cube.z, 1))) / 2,
      cube.z,
      OffsetCoordinatesType.Odd,
      Orientation.Pointy
    );
  }

  public static offsetOddPointyToCube(offset: OffsetCoordinates): CubeCoordinates {
    const x = offset.q - (offset.r - Utils.mod(offset.r, 1)) / 2;
    const z = offset.r;
    const y = - x - z;
    return new CubeCoordinates(x, y, z);
  }

  public static cubeToOffsetEvenPointy(cube: CubeCoordinates): OffsetCoordinates {
    return new OffsetCoordinates(
      cube.x + (cube.z + (Utils.mod(cube.z, 1))) / 2,
      cube.z,
      OffsetCoordinatesType.Even,
      Orientation.Pointy
    );
  }

  public static offsetEvenPointyToCube(offset: OffsetCoordinates): CubeCoordinates {
    const x = offset.q - (offset.r + Utils.mod(offset.r, 1)) / 2;
    const z = offset.r;
    const y = - x - z;
    return new CubeCoordinates(x, y, z);
  }

  public static cubeToOffsetOddFlat(cube: CubeCoordinates): OffsetCoordinates {
    return new OffsetCoordinates(
      cube.x,
      cube.z + (cube.x - (Utils.mod(cube.x, 1))) / 2,
      OffsetCoordinatesType.Odd,
      Orientation.Flat
    );
  }

  public static offsetOddFlatToCube(offset: OffsetCoordinates): CubeCoordinates {
    const x = offset.q;
    const z = offset.r - (offset.q - Utils.mod(offset.q, 1)) / 2;
    const y = - x - z;
    return new CubeCoordinates(x, y, z);
  }

  public static cubeToOffsetEvenFlat(cube: CubeCoordinates): OffsetCoordinates {
    return new OffsetCoordinates(
      cube.x,
      cube.z + (cube.x + (Utils.mod(cube.x, 1))) / 2,
      OffsetCoordinatesType.Even,
      Orientation.Flat
    );
  }

  public static offsetEvenFlatToCube(offset: OffsetCoordinates): CubeCoordinates {
    const x = offset.q;
    const z = offset.r - (offset.q + Utils.mod(offset.q, 1)) / 2;
    const y = - x - z;
    return new CubeCoordinates(x, y, z);
  }
}