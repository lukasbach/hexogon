import {Hexogon} from "./Hexogon";
import {HexogonRerenderReason} from "./options/HexogonRerenderReason";

export class FlagStore {
  private store: {[flag: string]: Hexogon[]};

  constructor() {
    this.store = {};
  }

  public getHexogonsWithFlag(flag: string) {
    return this.store[flag];
  }

  public getFlagsFromHexogon(hexogon: Hexogon) {
    return Object.keys(this.store).filter(k => this.store[k].includes(hexogon))
  }

  public hasHexogonFlag(hexogon: Hexogon, flag: string) {
    return this.store[flag] && this.store[flag].includes(hexogon);
  }

  public setFlag(flag: string, ...hexogons: Hexogon[]) {
    if (!Object.keys(this.store).includes(flag)) {
      this.store[flag] = hexogons;
    } else {
      this.store[flag].push(...hexogons);
    }

    this.rerenderHexogons(hexogons, HexogonRerenderReason.FlagAdded);
  }

  public removeFlag(flag: string, ...hexogons: Hexogon[]) {
    if (Object.keys(this.store).includes(flag)) {
      const removeCoords = hexogons.map(h => h.coordinates.toString())
      this.store[flag] = this.store[flag].filter(h => !removeCoords.includes(h.coordinates.toString()));

      this.rerenderHexogons(hexogons, HexogonRerenderReason.FlagRemoved);
    }
  }

  public clearFlag(flag: string, ...hexogons: Hexogon[]) {
    this.store[flag] = undefined;
    this.rerenderHexogons(hexogons, HexogonRerenderReason.FlagRemoved);
  }

  public clearAndSetFlag(flag: string, ...hexogons: Hexogon[]) {
    const oldHexogons = this.store[flag];

    this.store[flag] = hexogons;
    this.rerenderHexogons(hexogons, HexogonRerenderReason.FlagAdded);

    if (oldHexogons) {
      this.rerenderHexogons(oldHexogons, HexogonRerenderReason.FlagRemoved);
    }
  }

  public toggle(flag: string, hexogon: Hexogon) {
    if (this.hasHexogonFlag(hexogon, flag)) {
      this.removeFlag(flag, hexogon);
    } else {
      this.setFlag(flag, hexogon);
    }
  }

  private rerenderHexogons(hexogons: Hexogon[], reason: HexogonRerenderReason) {
    for (const hex of hexogons) {
      hex.forceRerender(reason);
    }
  }
}
