import {Orientation} from "./options/Orientation";
import {ICoordinates} from "./coordinates/Coordinates";
import {CubeCoordinates} from "./coordinates/CubeCoordinates";
import {PixelPosition} from "./PixelPosition";
import {Utils} from "./Utils";
import {EventEmitter} from "./events/EventEmitter";
import {HexogonRerenderReason} from "./options/HexogonRerenderReason";

export interface IHexagonOptions {
  size: number;
  coordinates: ICoordinates;
  orientation?: Orientation;
  spacing?: number;
  offset?: PixelPosition;
}

export class Hexogon<State extends object = {}> {
  private cubeCoordinates: CubeCoordinates;
  private size: number;
  private orientation: Orientation;
  private _state: State;

  public readonly events = {
    stateChange: new EventEmitter<{
      changedState: State,
      oldState: State
    }>(),
    created: new EventEmitter(),
    rerender: new EventEmitter<{
      reason: HexogonRerenderReason
    }>()
  };

  get width() {
    switch (this.orientation) {
      case Orientation.Flat:
        return 2 * this.size;
      case Orientation.Pointy:
        return Utils.Sqrt3 * this.size;
    }
  }

  get height() {
    switch (this.orientation) {
      case Orientation.Flat:
        return Utils.Sqrt3 * this.size;
      case Orientation.Pointy:
        return 2 * this.size;
    }
  }

  get widthAsVector() { return new PixelPosition(this.width, 0); }
  get heightAsVector() { return new PixelPosition(0, this.height); }
  get coordinates() { return this.cubeCoordinates; }
  get state(): State { return this._state; }

  get centerPixelPosition(): PixelPosition {
    switch (this.orientation) {
      case Orientation.Flat:
        /*return new PixelPosition(
          .75 * this.width * this.cubeCoordinates.y,
          0.5 * this.height * this.cubeCoordinates.y
        ).add(this.options.offset);*/

        return new PixelPosition(
          this.size * (3/2 * this.cubeCoordinates.x),
          this.size * (Utils.Sqrt3 / 2 * this.cubeCoordinates.x + Utils.Sqrt3 * this.cubeCoordinates.y),
        )
          .add(new PixelPosition(this.coordinates.x, this.coordinates.y).multiply(this.options.spacing || 1))
          .add(this.options.offset);
      case Orientation.Pointy:
        /*return new PixelPosition(
          .5 * this.width * this.cubeCoordinates.y,
          0.75 * this.height * this.cubeCoordinates.y
        ).add(this.options.offset);*/

        return new PixelPosition(
          this.size * (Utils.Sqrt3 * this.cubeCoordinates.x + Utils.Sqrt3/2 * this.cubeCoordinates.y),
          this.size * (3/2 * this.cubeCoordinates.y),
        )
          .add(new PixelPosition(this.coordinates.x, this.coordinates.y).multiply(this.options.spacing || 0))
          .add(this.options.offset);
    }
  }

  get corners(): [PixelPosition, PixelPosition, PixelPosition, PixelPosition, PixelPosition, PixelPosition] {
    const center = this.centerPixelPosition;
    const quarterWidth = this.widthAsVector.clone().multiply(.25);
    const halfWidth = this.widthAsVector.clone().multiply(.5);
    const quarterHeight = this.heightAsVector.clone().multiply(.25);
    const halfHeight = this.heightAsVector.clone().multiply(.5);

    switch (this.orientation) {
      // TODO can be made more performant because some variables share values
      case Orientation.Flat:
        return [
          center.clone().add(halfWidth).round(),
          center.clone().add(quarterWidth).add(halfHeight).round(),
          center.clone().subtract(quarterWidth).add(halfHeight).round(),
          center.clone().subtract(halfWidth).round(),
          center.clone().subtract(quarterWidth).subtract(halfHeight).round(),
          center.clone().add(quarterWidth).subtract(halfHeight).round(),
        ];
      case Orientation.Pointy:
        return [
          center.clone().subtract(halfHeight).round(),
          center.clone().add(halfWidth).subtract(quarterHeight).round(),
          center.clone().add(halfWidth).add(quarterHeight).round(),
          center.clone().add(halfHeight).round(),
          center.clone().subtract(halfWidth).add(quarterHeight).round(),
          center.clone().subtract(halfWidth).subtract(quarterHeight).round(),
        ];
    }
  }

  public constructor(private options: IHexagonOptions, initialState: State) {
    this.cubeCoordinates = options.coordinates.toCubeCoordinates();
    this.size = options.size;
    this.orientation = options.orientation || Orientation.Pointy;
    this._state = initialState;

    this.events.created.emit({});
  }

  public clone(): Hexogon<State> {
    return new Hexogon(this.options, Object.assign({}, this.state));
  }

  public isAt(coords: ICoordinates) {
    return coords.equal(this.cubeCoordinates);
  }

  public setState(state: Partial<State>) {
    const oldState = Object.assign({}, this._state);
    this._state = {...this._state, ...state};
    this.events.stateChange.emit({ oldState, changedState: this._state });
    this.events.rerender.emit({ reason: HexogonRerenderReason.StateChange });
  }

  public forceRerender(reason: HexogonRerenderReason = HexogonRerenderReason.Enforced) {
    this.events.rerender.emit({ reason });
  }

  public getNeighbourCoordinates(): ICoordinates[] {
    const neighbours = [
      new CubeCoordinates(1, -1, 0),
      new CubeCoordinates(1, 0, -1),
      new CubeCoordinates(0, 1, -1),
      new CubeCoordinates(-1, 1, 0),
      new CubeCoordinates(-1, 0, 1),
      new CubeCoordinates(0, -1, 1),
    ];

    return neighbours.map(c => c.add(this.coordinates));
  }

  public getDiagonalNeighbourCoordinates(): ICoordinates[] {
    const neighbours = [
      new CubeCoordinates(2, -1, -1),
      new CubeCoordinates(1, 1, -2),
      new CubeCoordinates(-1, 2, -1),
      new CubeCoordinates(-2, 1, 1),
      new CubeCoordinates(-1, -1, 2),
      new CubeCoordinates(1, -2, 1),
    ];

    return neighbours.map(c => c.add(this.coordinates));
  }

  public distanceTo(hexagon: Hexogon) {
    return this.cubeCoordinates.distanceTo(hexagon.coordinates.toCubeCoordinates());
  }

  public debugDrawToCanvas(ctx: CanvasRenderingContext2D) {
    const [firstCorner, ...otherCorners] = this.corners;
    const [x, y] = this.centerPixelPosition.arr;
    ctx.beginPath();
    ctx.moveTo(...firstCorner.arr);
    otherCorners.forEach(c => ctx.lineTo(...c.arr));
    ctx.lineTo(...firstCorner.arr);
    ctx.stroke();
    ctx.fillText(this.cubeCoordinates.toString(), x - 18, y, 18*2);
  }


}
