import {SvgRenderer} from "hexogon/lib/renderers/SvgRenderer";
import {HexogonGrid} from "hexogon/lib/HexogonGrid";
import {FlagStore} from "hexogon/lib/FlagStore";
import {colors} from "./utils";

export const example = () => {
  const container = document.createElement('div');

  const grid = new HexogonGrid();
  const renderer = new SvgRenderer(container, {});
  const flags = new FlagStore();

  grid.initializeHexagonShape([0, 0, 0], 4);

  renderer.deriveRenderData = hex => ({
    style: {
      backgroundColor: flags.hasHexogonFlag(hex, 'hovering') ? colors.primary : colors.dark,
      borderColor: colors.white
    }
  });

  renderer.events.onEnterHexogon.on(e => {
    flags.clearAndSetFlag('hovering', e.hexogon);
  });

  renderer.render(grid);

  return container;
};
