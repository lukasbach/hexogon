import {AbstractRenderer, IHexogonEventPayload, IHexogonRenderingStyles, IRendererOptions} from "./AbstractRenderer";
import {Hexogon} from "../Hexogon";
import {HexogonGrid} from "../HexogonGrid";
import {PixelPosition} from "../PixelPosition";
import {EventEmitter} from "../events/EventEmitter";

export class SvgRenderer<HexogonState extends object = {}> extends AbstractRenderer<HexogonState> {
  public readonly svg: SVGElement;
  public readonly svgNs: string;
  public readonly createChild: <T extends SVGElement>(type: string, container?: SVGElement) => T;

  constructor(element: SVGElement | HTMLElement, options: IRendererOptions) {
    super(options);

    if (element instanceof SVGElement) {
      this.svg = element;
    } else {
      this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      element.append(this.svg);
    }

    this.svgNs = this.svg.namespaceURI;
    this.createChild = <T extends SVGElement>(type, container) => {
      const child = document.createElementNS(this.svgNs, type);
      (container || this.svg).appendChild(child);
      return child as T;
    }
  }

  protected renderStyledHexagon(hex: Hexogon<HexogonState>, style: IHexogonRenderingStyles, text?: string) {
    const [firstCorner, ...otherCorners] = hex.corners
      .map(c => this.options.offset ? c.subtract(this.options.offset).arr : c.arr)
      .map(c => c.join(' '));

    const hexPath = this.createChild<SVGPathElement>('path');
    const textContainer = this.createChild<SVGTextElement>('text');
    const textEl = this.createChild<SVGTSpanElement>('tspan', textContainer);

    const d = `M ${firstCorner} ${otherCorners.map(c => `L ${c}`).join(' ')} L ${firstCorner}`;
    hexPath.setAttribute('d', d);

    this.resetHexogonAttributes(hexPath, textContainer, textEl, hex, style, text);

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
  }

  private resetHexogonAttributes(
    hexPath: SVGPathElement,
    textContainer: SVGTextElement,
    textEl: SVGTSpanElement,
    hex: Hexogon<HexogonState>,
    style: IHexogonRenderingStyles,
    text?: string
  ) {
    hexPath.setAttribute('stroke', style.borderColor);
    hexPath.setAttribute('stroke-width', `${style.borderWidth}`);
    hexPath.setAttribute('fill', style.backgroundColor);

    textContainer.setAttribute('text-anchor', 'end');

    textEl.setAttribute('x', `${hex.centerPixelPosition.x}`);
    textEl.setAttribute('y', `${hex.centerPixelPosition.y}`);
    textEl.innerHTML = text || '';
  }

  public render(grid: HexogonGrid<HexogonState>) {
    for (const hex of grid.getAllHexogons()) {
      this.renderHexogon(hex);
    }
  }
}
