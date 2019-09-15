import {Hexogon} from "../Hexogon";
import {PixelPosition} from "../PixelPosition";
import {HexogonGrid} from "../HexogonGrid";
import {EventEmitter} from "../events/EventEmitter";
import {
  AbstractRenderer,
  DeriveRenderDataType,
  IHexogonRenderingStyles,
  IRendererOptions,
  RenderFunctionType
} from "./AbstractRenderer";


export class CanvasRenderer<HexogonState extends object = {}> extends AbstractRenderer<HexogonState> {
  public readonly canvas: HTMLCanvasElement;
  public readonly ctx: CanvasRenderingContext2D;

  constructor(element: HTMLCanvasElement | HTMLElement, options: IRendererOptions) {
    super(options);

    if (element instanceof HTMLCanvasElement) {
      this.canvas = element;
    } else {
      this.canvas = document.createElement('canvas');
      element.append(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');
  }

  protected renderStyledHexagon(hex: Hexogon, style: IHexogonRenderingStyles, text?: string) {
    const [firstCorner, ...otherCorners] = hex.corners.map(c =>
      this.options.offset ? c.subtract(this.options.offset).arr : c.arr);
    this.ctx.beginPath();
    this.ctx.moveTo(...firstCorner);

    for (const c of otherCorners) {
      this.ctx.lineTo(...c);
    }

    this.ctx.lineTo(...firstCorner);

    this.prepareCanvasStylesForHexagon(style);

    this.ctx.fill();
    this.ctx.stroke();

    if (text) {
      this.prepareCanvasStylesForText(style);
      const [x, y] = hex.centerPixelPosition.arr;
      this.ctx.fillText(text, x, y, 40);
    }
  }

  private prepareCanvasStylesForHexagon(style: IHexogonRenderingStyles) {
    this.ctx.strokeStyle = style.borderColor || 'black';
    this.ctx.lineWidth = style.borderWidth;
    this.ctx.fillStyle = style.backgroundColor;

    // TODO gradient
    // TODO background image

  }

  private prepareCanvasStylesForText(style: IHexogonRenderingStyles) {
    this.ctx.fillStyle = style.textColor || 'black';
    this.ctx.font = `normal ${style.textSize || 12}px ${style.textFont || 'Verdana'}`;
  }

  public renderOnce(grid: HexogonGrid<HexogonState>) {
    console.log("!!!")
    for (const hex of grid.getAllHexogons()) {
      this.renderHexogon(hex);
    }
  }
}