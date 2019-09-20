import {HexogonGrid} from "./HexogonGrid";
import {Orientation} from "./options/Orientation";
import {PixelPosition} from "./PixelPosition";
import {Hexogon} from "./Hexogon";

interface DemoHexogonState {
  isHovering: boolean;
  color?: ColorSet;
  text?: string;
}

interface ColorSet {
  bg: string;
  border: string;
  text: string;
}

export class DemoGrid {
  public static colors: {[key: string]: ColorSet} = {
    default: { bg: '#bdc3c7', border: '#95a5a6', text: 'black' },
    hovering: { bg: '#f1c40f', border: '#f39c12', text: 'black' },
    primary: { bg: '#3498db', border: '#2980b9', text: 'white' },
    secondary: { bg: '#9b59b6', border: '#8e44ad', text: 'white' },
    tertiary: { bg: '#2ecc71', border: '#27ae60', text: 'black' },
  };

  public grid: HexogonGrid<DemoHexogonState>;
  private hoveringHex: Hexogon<DemoHexogonState> | undefined;
  private ctx: CanvasRenderingContext2D;

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d");

    this.grid = new HexogonGrid({
      orientation: Orientation.Pointy,
      defaultHexogonState: { isHovering: false },
      spacing: 0,
      hexogonSize: 24
    });

    this.grid.initializeHexagonShape([5, 9, -14], 8);

    canvas.onmousemove = e => {
      const [x, y] = [e.offsetX, e.offsetY];
      const newHoveringHex = this.grid.getHexogonAtPixelCoords(new PixelPosition(x, y));

      if (!this.hoveringHex || !newHoveringHex.coordinates.equal(this.hoveringHex.coordinates)) {
        if (this.hoveringHex) {
          this.hoveringHex.setState({ isHovering: false });
        }
        if (newHoveringHex) {
          newHoveringHex.setState({ isHovering: true });
        }
        this.hoveringHex = newHoveringHex;
      }
    };

    this.grid.events.hexogonStateChange.on(({changedHexogon}) => this.renderHexogon(changedHexogon));

    for (let hex of this.grid.getAllHexogons()) {
      this.renderHexogon(hex);
    }
  }

  private renderHexogon(hex: Hexogon<DemoHexogonState>) {
    const {bg, border, text} = hex.state.isHovering ? DemoGrid.colors.hovering : hex.state.color || DemoGrid.colors.default;
    const [firstCorner, ...otherCorners] = hex.corners;
    this.ctx.beginPath();
    this.ctx.moveTo(...firstCorner.arr);

    for (const c of otherCorners) {
      this.ctx.lineTo(...c.arr);
    }

    this.ctx.lineTo(...firstCorner.arr);

    this.ctx.fillStyle = bg;
    this.ctx.strokeStyle = border;

    this.ctx.fill();
    this.ctx.stroke();

    if (hex.state.text) {
      const [x, y] = hex.centerPixelPosition.add(new PixelPosition(0, 4)).arr;
      this.ctx.fillStyle = text;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(hex.state.text, x, y, 40);
    }
  }
}