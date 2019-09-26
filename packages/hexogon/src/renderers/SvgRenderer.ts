import {AbstractRenderer, IHexogonEventPayload, IHexogonRenderingStyles, IRendererOptions} from "./AbstractRenderer";
import {Hexogon} from "../Hexogon";
import {HexogonGrid} from "../HexogonGrid";
import {PixelPosition} from "../PixelPosition";
import {EventEmitter} from "../events/EventEmitter";

interface ISvgRendererCustomStyles {
  strokeInset: boolean;
}

export class SvgRenderer<HexogonState extends object = {}> extends AbstractRenderer<HexogonState, ISvgRendererCustomStyles> {
  public readonly svg: SVGElement;
  public readonly htmlContainer?: HTMLElement;
  public readonly svgNs: string;
  public readonly createChild: <T extends SVGElement>(type: string, container?: SVGElement) => T;

  constructor(element: SVGElement | HTMLElement, options: IRendererOptions) {
    super(options);

    if (element instanceof SVGElement) {
      this.svg = element;
    } else {
      this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      element.append(this.svg);
      this.htmlContainer = element;
    }

    this.svgNs = this.svg.namespaceURI;
    this.createChild = <T extends SVGElement>(type, container) => {
      const child = document.createElementNS(this.svgNs, type);
      (container || this.svg).appendChild(child);
      return child as T;
    }
  }

  protected renderStyledHexagon(hex, style, text?: string) {
    const hexPath = this.createChild<SVGPathElement>('path');
    const textContainer = this.createChild<SVGTextElement>('text');
    const textEl = this.createChild<SVGTSpanElement>('tspan', textContainer);

    this.resetHexogonAttributes(hexPath, textContainer, textEl, hex, style, text);
    this.resetHexogonPositionings(hexPath, textContainer, textEl, hex);

    const createEvent = (emitter: EventEmitter<IHexogonEventPayload<HexogonState>>) => (e: { offsetX: number, offsetY: number }) => emitter.emit({
      hexogon: hex,
      mousePosition: new PixelPosition(e.offsetX, e.offsetY),
      event: e
    });

    hexPath.addEventListener("mouseenter", createEvent(this.events.onEnterHexogon));
    hexPath.addEventListener("mouseleave", createEvent(this.events.onLeaveHexogon));
    hexPath.addEventListener("click", createEvent(this.events.onClickHexogon));
    hexPath.addEventListener("contextmenu", createEvent(this.events.onRightHexogon));

    hex.events.rerender.on(payload => {
      const { style, text } = this.deriveRenderData(hex);
      this.resetHexogonAttributes(hexPath, textContainer, textEl, hex, style, text);
    });

    this.events.onForceRereder.on(() => {
      this.resetHexogonPositionings(hexPath, textContainer, textEl, hex);
    })
  }

  private resetHexogonAttributes(
    hexPath: SVGPathElement,
    textContainer: SVGTextElement,
    textEl: SVGTSpanElement,
    hex: Hexogon<HexogonState>,
    style: Partial<ISvgRendererCustomStyles> & IHexogonRenderingStyles,
    text?: string
  ) {
    hexPath.setAttribute('fill', style.backgroundColor);

    if (style.strokeInset) {
      // hexPath.setAttribute('outline-color', style.borderColor);
      // hexPath.setAttribute('outline-width', `${style.borderWidth}px`);
      // hexPath.setAttribute('outline-offset', `-${style.borderWidth}px`);
      // hexPath.setAttribute('outline-style', `${style.borderStyle || 'solid'}`);
      hexPath.setAttribute('style', `
        outline-color: ${style.borderColor};
        outline-width: ${style.borderWidth}px;
        outline-offset: -${style.borderWidth}px;
        outline-style: ${style.borderStyle || 'solid'};
      `)
    } else {
      hexPath.setAttribute('stroke', style.borderColor);
      hexPath.setAttribute('stroke-width', `${style.borderWidth}`);
    }

    textContainer.setAttribute('text-anchor', 'middle');
    textEl.innerHTML = text || '';
  }

  private resetHexogonPositionings(
    hexPath: SVGPathElement,
    textContainer: SVGTextElement,
    textEl: SVGTSpanElement,
    hex: Hexogon<HexogonState>
  ) {
    const [firstCorner, ...otherCorners] = hex.corners
      .map(c => this.options.offset ? c.add(this.options.offset).arr : c.arr)
      .map(c => c.join(' '));

    const d = `M ${firstCorner} ${otherCorners.map(c => `L ${c}`).join(' ')} L ${firstCorner}`;
    hexPath.setAttribute('d', d);

    textEl.setAttribute('x', `${hex.centerPixelPosition.x + this.options.offset.x}`);
    textEl.setAttribute('y', `${hex.centerPixelPosition.y + this.options.offset.y}`);
  }

  public adaptSize(grid: HexogonGrid) {
    const boundingBox = grid.getBoundingBox();

    if (this.options.centerGrid) {
      this.options.offset = new PixelPosition(boundingBox.width / 2 + grid.hexogonSize, boundingBox.height / 2 + grid.hexogonSize);
    }

    if (this.options.adaptSizeToGrid) {
      this.svg.setAttribute('width', `${boundingBox.width + 2 * grid.hexogonSize}`);
      this.svg.setAttribute('height', `${boundingBox.height + 2 * grid.hexogonSize}`);
    }

    this.events.onForceRereder.emit({});
  }

  public render(grid: HexogonGrid<HexogonState>) {
    for (const hex of grid.getAllHexogons()) {
      this.renderHexogon(hex);
    }

    this.adaptSize(grid);
  }
}
