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

export type RenderFunctionType<HexogonState extends object>
  = (hex: Hexogon<HexogonState>) => any;
export type DeriveRenderDataType<HexogonState extends object>
  = (hex: Hexogon<HexogonState>) => { style: IHexogonRenderingStyles, text?: string };

export abstract class AbstractRenderer<HexogonState extends object> {
  public renderFunction: RenderFunctionType<HexogonState> = (hex) => {
    const { style, text } = this.deriveRenderData(hex);
    this.renderStyledHexagon(hex, style, text);
  };

  public deriveRenderData: DeriveRenderDataType<HexogonState> = (hex) => ({
    style: {}
  });

  public readonly events = {
    onHoverHexogon: new EventEmitter<{
      hexogon: Hexogon<HexogonState>,
      mousePosition: PixelPosition
    }>(),
    onEnterHexogon: new EventEmitter<{
      hexogon: Hexogon<HexogonState>,
      mousePosition: PixelPosition
    }>(),
    onLeaveHexogon: new EventEmitter<{
      hexogon: Hexogon<HexogonState>,
      mousePosition: PixelPosition
    }>(),
  };

  constructor(public readonly options: IRendererOptions) {}

  protected abstract renderStyledHexagon(hex: Hexogon, style: IHexogonRenderingStyles, text?: string);

  public renderHexogon(hex: Hexogon<HexogonState>) {
    this.renderFunction(hex);
  }
}