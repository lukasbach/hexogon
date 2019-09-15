import {GridStorageType} from "./options/GridStorageType";
import {GridStorage} from "./storage/GridStorage";
import {Hexogon, IHexagonOptions} from "./Hexogon";
import {DenseGridStorage} from "./storage/DenseGridStorage";
import {SparseGridStorage} from "./storage/SparseGridStorage";
import {CoordinateLazyParameter, ICoordinates} from "./coordinates/Coordinates";
import {LazyCoordinateConstructor} from "./coordinates/LazyCoordinateConstructor";
import {OffsetCoordinatesType} from "./options/OffsetCoordinatesType";
import {Orientation} from "./options/Orientation";
import {PixelPosition} from "./PixelPosition";
import {AxialCoordinates} from "./coordinates/AxialCoordinates";
import {Utils} from "./Utils";
import {EventEmitter} from "./events/EventEmitter";
import {LineDrawingInterpolation} from "./LineDrawingInterpolation";
import {CoordinateUtils} from "./coordinates/CoordinateUtils";
import {CubeCoordinates} from "./coordinates/CubeCoordinates";

export interface IHexogonGridOptions<HexogonState> {
  orientation?: Orientation;
  storage?: GridStorageType
  offset?: PixelPosition;
  hexogonSize?: number;
  spacing?: number;
  defaultHexogonState?: HexogonState;
}

export class HexogonGrid<HexogonState extends object = {}> {
  private storage: GridStorage<HexogonState>;
  private orientation: Orientation;
  private offset: PixelPosition;
  private hexogonSize: number;
  private spacing: number;

  public readonly events = {
    hexogonStateChange: new EventEmitter<{
      changedHexogon: Hexogon<HexogonState>;
      changedState: HexogonState;
      oldState: HexogonState;
    }>(),
  };

  constructor(private options: IHexogonGridOptions<HexogonState>) {
    this.orientation = options.orientation || Orientation.Pointy;
    this.offset = options.offset || new PixelPosition(0, 0);
    this.hexogonSize = options.hexogonSize || 24;
    this.spacing = options.spacing || 0;

    const storageType = options.storage || GridStorageType.Sparse;

    if (options.storage === GridStorageType.Dense) {
      this.storage = new DenseGridStorage();
    } else {
      this.storage = new SparseGridStorage();
    }
  }

  public clone(): HexogonGrid<HexogonState> {
    const grid = new HexogonGrid(this.options);
    grid.storeHexogons(...this.storage.getAll().map(hex => hex.clone()));
    return grid;
  }

  public initializeRhombusShape(
    leftTopPoint: CoordinateLazyParameter,
    width: number,
    height: number,
    hexagonConstructor?: (coords: ICoordinates, defaultOptions: IHexagonOptions) => Hexogon<HexogonState>,
    offsetType: OffsetCoordinatesType = OffsetCoordinatesType.Odd
  ) {
    const point = LazyCoordinateConstructor.lazyConstruct(leftTopPoint);
    hexagonConstructor = hexagonConstructor
      || ((coords, defaultOptions) => new Hexogon(defaultOptions, this.options.defaultHexogonState));

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const hexP = point.toCubeCoordinates().add(new AxialCoordinates(x, y)); //.toOffsetCoordinates(offsetType, this.orientation);
        this.storeHexogons(hexagonConstructor(hexP, {
          offset: this.offset,
          orientation: this.orientation,
          coordinates: hexP,
          size: this.hexogonSize,
          spacing: this.spacing
        }));
      }
    }
  }

  public initializeHexagonShape(
    centerPoint: CoordinateLazyParameter,
    radius: number,
    hexagonConstructor?: (coords: ICoordinates, defaultOptions: IHexagonOptions) => Hexogon<HexogonState>,
    offsetType: OffsetCoordinatesType = OffsetCoordinatesType.Odd
  ) {
    const point = LazyCoordinateConstructor.lazyConstruct(centerPoint).toCubeCoordinates();
    hexagonConstructor = hexagonConstructor
      || ((coords, defaultOptions) => new Hexogon(defaultOptions, this.options.defaultHexogonState));

    const coords = CoordinateUtils.getCoordsInRange(point, radius);

    for (let coord of coords) {
      this.storeHexogons(hexagonConstructor(coord, {
        offset: this.offset,
        orientation: this.orientation,
        coordinates: coord,
        size: this.hexogonSize,
        spacing: this.spacing
      }));
    }
  }

  public debugDrawToCanvas(ctx: CanvasRenderingContext2D) {
    this.storage.getAll().forEach(h => h.debugDrawToCanvas(ctx));
  }

  public getHexogonCoordsFromPixelCoords(point: PixelPosition): ICoordinates {
    point.subtract(this.options.offset);
    let q: number;
    let r: number;

    if (this.orientation === Orientation.Pointy) {
      q = (Utils.Sqrt3/3 * point.x - 1/3 * point.y) / this.hexogonSize;
      r = (2/3 * point.y) / this.hexogonSize;
    } else {
      q =  (2/3 * point.x) / this.hexogonSize;
      r = (Utils.Sqrt3/3 * point.y - 1/3 * point.x) / this.hexogonSize;
    }

    return new CubeCoordinates(q, r, - q - r).round();
  }

  public getHexogonAtPixelCoords(point: PixelPosition): Hexogon<HexogonState> | undefined {
    return this.storage.getAt(this.getHexogonCoordsFromPixelCoords(point));
  }

  public getAllHexogons(): Array<Hexogon<HexogonState>> {
    return this.storage.getAll();
  }

  public getHexogonAtCoords(coords: ICoordinates): Hexogon<HexogonState> | undefined {
    return this.storage.getAt(coords);
  }

  public getNeighboursOfHexogon(hex: Hexogon<HexogonState>): Array<Hexogon<HexogonState>> {
    return hex.getNeighbourCoordinates()
      .map(c => this.getHexogonAtCoords(c))
      .filter(h => !!h);
  }

  public getDiagonalNeighboursOfHexogon(hex: Hexogon<HexogonState>): Array<Hexogon<HexogonState>> {
    return hex.getDiagonalNeighbourCoordinates()
      .map(c => this.getHexogonAtCoords(c))
      .filter(h => !!h);
  }

  public interpolateLineToCoordinates(from: Hexogon | ICoordinates, to: Hexogon | ICoordinates): ICoordinates[] {
    return LineDrawingInterpolation
      .draw((from as Hexogon).coordinates || (from as ICoordinates), (to as Hexogon).coordinates || (to as ICoordinates));
  }

  public interpolateLineToHexogons(from: Hexogon | ICoordinates, to: Hexogon | ICoordinates): Array<Hexogon<HexogonState>> {
    return this.interpolateLineToCoordinates(from, to).map(c => this.getHexogonAtCoords(c)).filter(h => !!h);
  }

  public getHexogonsInRange(center: Hexogon, range: number): Array<Hexogon<HexogonState>> {
    return CoordinateUtils.getCoordsInRange(center.coordinates, range)
      .map(coords => this.getHexogonAtCoords(coords))
      .filter(hex => !!hex);
  }

  // TODO story
  public isVisible(camera: Hexogon, target: Hexogon, isObstacle: (hex: Hexogon<HexogonState>) => boolean): boolean {
    return !this.interpolateLineToHexogons(camera, target).map(isObstacle).reduce((a, b) => a || b, false);
  }

  // TODO story
  public compileVisibilityMap(camera: Hexogon, isObstacle: (hex: Hexogon<HexogonState>) => boolean)
    : Array<{ hexogon: Hexogon<HexogonState>, isVisible: boolean }> {
    // TODO very inefficient because of high call redundancy
    return this.storage.getAll().map(hex => ({
      hexogon: hex,
      isVisible: this.isVisible(camera, hex, isObstacle)
    }));
  }

  public storeHexogons(...hexogons: Array<Hexogon<HexogonState>>) {
    this.storage.store(...hexogons);

    for (let hex of hexogons) {
      hex.events.stateChange.on(payload => this.events.hexogonStateChange.emit({
        changedHexogon: hex,
        ...payload
      }))
    }
  }
}
