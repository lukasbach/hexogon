import {EventEmitter} from "../events/EventEmitter";
import {Hexogon} from "../Hexogon";
import {PixelPosition} from "../PixelPosition";
import {HexogonGrid} from "../HexogonGrid";

export interface IRendererOptions {
  offset?: PixelPosition;
  centerGrid?: boolean;
  adaptSizeToGrid?: boolean;
  adaptSizeToParent?: boolean;
}

export interface IHexogonRenderingStyles {
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: string;
  borderRadius?: number;
  backgroundColor?: string;
  backgroundImage?: string;
  shadowOutset?: object;
  shadowInset?: object;
  text?: string;
  textColor?: string;
  textFont?: string;
  textSize?: string;
  textPadding?: number;
}

export interface IHexogonEventPayload<HexogonState extends object> {
  hexogon: Hexogon<HexogonState>,
  mousePosition: PixelPosition,
  event?: any
}

export type RenderFunctionType<HexogonState extends object>
  = (hex: Hexogon<HexogonState>) => any;
export type DeriveRenderDataFunctionType<HexogonState extends object, CustomRenderingStyles extends object = {}>
  = (hex: Hexogon<HexogonState>) => DerivedRenderData<CustomRenderingStyles>;
export type DerivedRenderData<CustomRenderingStyles extends object = {}>
  = { style: Partial<CustomRenderingStyles> & IHexogonRenderingStyles, text?: string };

export interface IRendererEvents<HexogonState extends object> {
  /** Fires when the user clicks on a hexogon. */
  onClickHexogon: EventEmitter<IHexogonEventPayload<HexogonState>>,
  /** Fires when the user double-clicks on a hexogon. */
  onDoubleClickHexogon: EventEmitter<IHexogonEventPayload<HexogonState>>,
  /** Fires when the user clicks on a hexogon with the right mouse-button (context menu event) */
  onRightHexogon: EventEmitter<IHexogonEventPayload<HexogonState>>,
  /** Fires when the user enters the hexogon with his mouse. */
  onEnterHexogon: EventEmitter<IHexogonEventPayload<HexogonState>>,
  /** Fires when the user leaves the hexogon with his mouse. */
  onLeaveHexogon: EventEmitter<IHexogonEventPayload<HexogonState>>,
  /** Emit an event on this emitter to force a rerender of the grid. */
  onForceRereder: EventEmitter<{}>,
}

export abstract class AbstractRenderer<
  HexogonState extends object = {},
  CustomRenderingStyles extends object = {}
> {
  public renderFunction: RenderFunctionType<HexogonState> = (hex) => {
    const { style, text } = this.deriveRenderData(hex);
    this.renderStyledHexagon(hex, style, text);
  };

  /**
   * This function specifies how style- and content-information is derived from the
   * internal data from a hexogon, i.e. from its coordinates and its state. By default
   * it returns empty styling and text.
   *
   * Overwrite this method to customize which styles and contents a hexagon will
   * generate.
   * @param hex a Hexogon object for which styles should be derived.
   * @return an object containing the properties style (containing derived styles for
   *   supplied hexogon) and text (optional).
   * @see DeriveRenderDataFunctionType
   */
  public deriveRenderData: DeriveRenderDataFunctionType<HexogonState, CustomRenderingStyles> = (hex) => ({
    style: {}
  });

  public readonly events: IRendererEvents<HexogonState>;

  constructor(public readonly options: IRendererOptions) {
    if (!this.options.offset) {
      this.options.offset = new PixelPosition(0, 0);
    }

    if (this.options.adaptSizeToGrid === undefined) {
      this.options.adaptSizeToGrid = true;
    }

    if (this.options.centerGrid === undefined) {
      this.options.centerGrid = true;
    }

    this.events = {
      /** Fires when the user clicks on a hexogon. */
      onClickHexogon: new EventEmitter<IHexogonEventPayload<HexogonState>>(),
      /** Fires when the user double-clicks on a hexogon. */
      onDoubleClickHexogon: new EventEmitter<IHexogonEventPayload<HexogonState>>(),
      /** Fires when the user clicks on a hexogon with the right mouse-button (context menu event) */
      onRightHexogon: new EventEmitter<IHexogonEventPayload<HexogonState>>(),
      /** Fires when the user enters the hexogon with his mouse. */
      onEnterHexogon: new EventEmitter<IHexogonEventPayload<HexogonState>>(),
      /** Fires when the user leaves the hexogon with his mouse. */
      onLeaveHexogon: new EventEmitter<IHexogonEventPayload<HexogonState>>(),
      onForceRereder: new EventEmitter<{}>(),
    }
  }

  protected abstract renderStyledHexagon(hex: Hexogon<HexogonState>, style: Partial<CustomRenderingStyles> & IHexogonRenderingStyles, text?: string);

  public renderHexogon(hex: Hexogon<HexogonState>) {
    this.renderFunction(hex);
  }

  public getBoundingBox(grid: HexogonGrid) {
    const { bottomRight, height, topLeft, width } = grid.getBoundingBox();
    const offset = this.options.offset;
    return {
      width: width + offset.x,
      height: height + offset.y,
      bottomRight: bottomRight.add(offset),
      topLeft: topLeft.add(offset)
    };
  }
}

