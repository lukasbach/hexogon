import {AbstractRenderer, IHexogonRenderingStyles, IRendererOptions} from "./AbstractRenderer";
import {Hexogon} from "../Hexogon";
import {HexogonGrid} from "../HexogonGrid";

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

  protected renderStyledHexagon(hex: Hexogon, style: IHexogonRenderingStyles, text?: string) {
    const [firstCorner, ...otherCorners] = hex.corners
      .map(c => this.options.offset ? c.subtract(this.options.offset).arr : c.arr)
      .map(c => c.join(' '));

    const hexPath = this.createChild<SVGPathElement>('path');
    const textContainer = this.createChild<SVGTextElement>('text');
    const textEl = this.createChild<SVGTSpanElement>('tspan', textContainer);

    const d = `M ${firstCorner} ${otherCorners.map(c => `L ${c}`).join(' ')} L ${firstCorner}`;
    hexPath.setAttribute('d', d);
    hexPath.setAttribute('stroke', style.borderColor);
    hexPath.setAttribute('stroke-width', `${style.borderWidth}`);
    hexPath.setAttribute('fill', style.backgroundColor);

    textContainer.setAttribute('text-anchor', 'end');

    textEl.setAttribute('x', `${hex.centerPixelPosition.x}`);
    textEl.setAttribute('y', `${hex.centerPixelPosition.y}`);
  }

  public renderOnce(grid: HexogonGrid<HexogonState>) {
    for (const hex of grid.getAllHexogons()) {
      this.renderHexogon(hex);
    }
  }
}