import {storiesOf} from '@storybook/html';
import {HexogonGrid} from "../src/HexogonGrid";
import {SvgRenderer} from "../src/renderers/SvgRenderer";
import {DemoGrid} from "../src/DemoGrid";
import {Hexogon} from "../src/Hexogon";
import {HexogonStateOf} from "../src/typeHelpers";
import {FlagStore} from "../src/FlagStore";


storiesOf('Features', module)
  .add('Flagstore', () => {
    const container = document.createElement('div');

    const grid = new HexogonGrid();
    const renderer = new SvgRenderer(container, {});
    const flags = new FlagStore();

    grid.initializeHexagonShape([5, 9, -14], 8);

    renderer.deriveRenderData = hex => ({
      style: {
        backgroundColor: (flags.hasHexogonFlag(hex, 'hovering') ? DemoGrid.colors.secondary : DemoGrid.colors.primary).bg,
        borderColor: DemoGrid.colors.primary.border
      }
    });

    renderer.events.onEnterHexogon.on(e => {
      flags.clearAndSetFlag('hovering', e.hexogon);
    });

    renderer.render(grid);
    renderer.svg.setAttribute('width', '800');
    renderer.svg.setAttribute('height', '800');

    return container;
  })
  .add('Flagstore Example 2', () => {
    const container = document.createElement('div');
    const coordsContainer = document.createElement('div');

    const grid = new HexogonGrid();
    const renderer = new SvgRenderer(container, {});
    const flags = new FlagStore();

    grid.initializeHexagonShape([5, 9, -14], 8);

    renderer.deriveRenderData = hex => ({
      style: {
        backgroundColor: (flags.hasHexogonFlag(hex, 'hovering')
          ? DemoGrid.colors.secondary : flags.hasHexogonFlag(hex, 'active')
            ? DemoGrid.colors.primary : DemoGrid.colors.default).bg,
        borderColor: DemoGrid.colors.default.border
      }
    });

    renderer.events.onEnterHexogon.on(e => {
      flags.clearAndSetFlag('hovering', e.hexogon);
    });

    renderer.events.onClickHexogon.on(e => {
      flags.toggle('active', e.hexogon);
      coordsContainer.innerHTML = flags.getHexogonsWithFlag('active')
        .map(h => h.coordinates.toString()).join('<br>')
    });

    renderer.render(grid);
    renderer.svg.setAttribute('width', '750');
    renderer.svg.setAttribute('height', '700');
    container.appendChild(coordsContainer);

    return container;
  });
