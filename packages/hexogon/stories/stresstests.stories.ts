import {storiesOf} from '@storybook/html';
import {HexogonGrid} from "../src/HexogonGrid";
import {SvgRenderer} from "../src/renderers/SvgRenderer";
import {DemoGrid} from "../src/DemoGrid";
import {Hexogon} from "../src/Hexogon";
import {HexogonStateOf} from "../src/typeHelpers";
import {FlagStore} from "../src/FlagStore";


storiesOf('Stresstest', module)
  .add('Flashing Grid on SVG', () => {
    const container = document.createElement('div');
    const coordsContainer = document.createElement('div');

    const grid = new HexogonGrid();
    const renderer = new SvgRenderer(container, {});
    const flags = new FlagStore();

    grid.initializeHexagonShape([5, 9, -14], 8);

    renderer.deriveRenderData = hex => ({
      style: {
        backgroundColor: (flags.hasHexogonFlag(hex, 'color')? DemoGrid.colors.primary : DemoGrid.colors.default).bg,
        borderColor: DemoGrid.colors.default.border
      }
    });

    const randHex = (count: number) => grid.getAllHexogons()
      .sort((a, b) => Math.random() - Math.random()).slice(0, count);

    setInterval(() => {
      flags.clearAndSetFlag('color', ...randHex(30));
    }, 20);

    renderer.render(grid);
    renderer.svg.setAttribute('width', '750');
    renderer.svg.setAttribute('height', '700');
    container.appendChild(coordsContainer);

    return container;
  });
