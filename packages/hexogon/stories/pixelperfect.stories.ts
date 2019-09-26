import {storiesOf} from '@storybook/html';
import {HexogonGrid} from "../src/HexogonGrid";
import {SvgRenderer} from "../src/renderers/SvgRenderer";
import {DemoGrid} from "../src/DemoGrid";
import {Hexogon} from "../src/Hexogon";
import {HexogonStateOf} from "../src/typeHelpers";
import {FlagStore} from "../src/FlagStore";
import {LazyCoordinateConstructor} from "../src/coordinates/LazyCoordinateConstructor";
import {CubeCoordinates} from "../src/coordinates/CubeCoordinates";
import {CanvasRenderer} from "../src/renderers/CanvasRenderer";


storiesOf('Pixelart Rendering', module)
  .add('Pixelated example', () => {
    const canvas = document.createElement('canvas');

    canvas.width = 800;
    canvas.height = 800;
    canvas.style.width = '200%';
    canvas.style.height = '200%';

    canvas.style.imageRendering = 'pixelated';
    canvas.getContext("2d").imageSmoothingEnabled = false;
    canvas.getContext("2d").globalAlpha = 1;
    // TODO custom line drawing if pixelart flag is set

    const grid = new HexogonGrid();
    const renderer = new CanvasRenderer(canvas, { adaptSizeToGrid: false, adaptSizeToParent: false });
    const flags = new FlagStore();

    grid.initializeHexagonShape([2, 2], 2);

    renderer.deriveRenderData = hex => ({
      style: {
        backgroundColor: (flags.hasHexogonFlag(hex, 'hovering') ? DemoGrid.colors.secondary : DemoGrid.colors.primary).bg,
        borderColor: DemoGrid.colors.primary.border
      }
    });

    renderer.events.onEnterHexogon.on(e => {
      flags.clearAndSetFlag('hovering', e.hexogon);
    });

    renderer.renderOnce(grid);

    return canvas;
  });
