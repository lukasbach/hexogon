import {HorizontalRelativePosition} from "./options/HorizontalRelativePosition";
import {VerticalRelativePosition} from "./options/VerticalRelativePosition";

export class PixelPosition {
  get arr(): [number, number] {
    return [this.x, this.y];
  }

  public constructor(public x: number, public y: number) {};

  public static max(...pos: PixelPosition[]): PixelPosition {
    return pos.reduce((a, b) => new PixelPosition(Math.max(a.x, b.x), Math.max(a.y, b.y)));
  }

  public static min(...pos: PixelPosition[]): PixelPosition {
    return pos.reduce((a, b) => new PixelPosition(Math.min(a.x, b.x), Math.min(a.y, b.y)));
  }

  public clone() {
    return new PixelPosition(this.x, this.y);
  }

  public add(pos: PixelPosition | undefined | false | null) {
    if (pos) {
      this.x += pos.x;
      this.y += pos.y;
    }

    return this;
  }

  public subtract(pos: PixelPosition | undefined | false | null) {
    if (pos) {
      this.x -= pos.x;
      this.y -= pos.y;
    }

    return this;
  }

  public multiply(n: number) {
    this.x *= n;
    this.y *= n;
    return this;
  }

  public round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  public getHorizontalRelativePosition(otherPosition: PixelPosition): HorizontalRelativePosition {
    return this.x > otherPosition.x ? HorizontalRelativePosition.Right : this.x === otherPosition.x
      ? HorizontalRelativePosition.Same : HorizontalRelativePosition.Left;
  }

  public getVerticalRelativePosition(otherPosition: PixelPosition): VerticalRelativePosition {
    return this.y > otherPosition.y ? VerticalRelativePosition.Below : this.y === otherPosition.y
      ? VerticalRelativePosition.Same : VerticalRelativePosition.Above;
  }
}
