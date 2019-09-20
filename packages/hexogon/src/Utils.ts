export class Utils {
  static Sqrt3 = Math.sqrt(3);

  static mod(n: number, modus: number): number {
    return ((n % modus) + modus) % modus;
  }
}