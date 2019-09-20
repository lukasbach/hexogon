import {EventEmitter} from "../events/EventEmitter";
import {Hexogon} from "../Hexogon";
import {PixelPosition} from "../PixelPosition";

export interface IRendererOptions {
  offset?: PixelPosition;
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
export type DeriveRenderDataFunctionType<HexogonState extends object>
  = (hex: Hexogon<HexogonState>) => DerivedRenderData;
export type DerivedRenderData = { style: IHexogonRenderingStyles, text?: string };

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
}

export abstract class AbstractRenderer<HexogonState extends object = {}> {
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
  public deriveRenderData: DeriveRenderDataFunctionType<HexogonState> = (hex) => ({
    style: {}
  });

  public readonly events: IRendererEvents<HexogonState>;

  constructor(public readonly options: IRendererOptions) {
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
    }
  }

  protected abstract renderStyledHexagon(hex: Hexogon<HexogonState>, style: IHexogonRenderingStyles, text?: string);

  public renderHexogon(hex: Hexogon<HexogonState>) {
    this.renderFunction(hex);
  }
}
