import {storiesOf} from '@storybook/html';
import {HexogonGrid} from "../src/HexogonGrid";
import {SvgRenderer} from "../src/renderers/SvgRenderer";
import {DemoGrid} from "../src/DemoGrid";
import {Hexogon} from "../src/Hexogon";
import {HexogonStateOf} from "../src/typeHelpers";
import {PixelPosition} from "../src/PixelPosition";
import {FlagStore} from "../src/FlagStore";


storiesOf('SVG Renderer', module)
  .add('Minimalistic Example', () => {
    const container = document.createElement('div');

    const grid = new HexogonGrid({});
    grid.initializeHexagonShape([0, 0, 0], 8);
    const renderer = new SvgRenderer(container, {});
    renderer.render(grid);

    return container;
  })
  .add('Hovering Example', () => {
    const container = document.createElement('div');

    const grid = new HexogonGrid<{ hovering: boolean }>({ defaultHexogonState: {hovering: false}, hexogonSize: 64 });
    grid.initializeHexagonShape([0,0,0], 4);

    const renderer = new SvgRenderer<HexogonStateOf<typeof grid>>(container, { offset: new PixelPosition(400, 400) });

    renderer.deriveRenderData = hex => ({
      style: {
        backgroundColor: (hex.state.hovering ? DemoGrid.colors.secondary : DemoGrid.colors.primary).bg,
        borderColor: DemoGrid.colors.primary.border
      },
      text: `x=${hex.coordinates.x},y=${hex.coordinates.y},z=${hex.coordinates.z}`
    });

    let hovering: Hexogon | undefined;
    renderer.events.onEnterHexogon.on(e => {
      if (hovering) hovering.setState({ hovering: false });
      hovering = e.hexogon;
      hovering.setState({ hovering: true });
    });

    renderer.render(grid);

    return container;
  })
  .add('Stroke inset', () => {
    const container = document.createElement('div');

    const grid = new HexogonGrid<{ hovering: boolean }>({ defaultHexogonState: {hovering: false}, hexogonSize: 64 });
    const flags = new FlagStore();
    const renderer = new SvgRenderer<HexogonStateOf<typeof grid>>(container, {});
    grid.initializeHexagonShape([0,0,0], 4);


    renderer.deriveRenderData = hex => ({
      style: {
        backgroundColor: DemoGrid.colors.default.bg,
        borderColor: DemoGrid.colors.primary.border,
        borderWidth: flags.hasHexogonFlag(hex, 'hovering') ? 64 : 2,
        strokeInset: true
      }
    });

    let hovering: Hexogon | undefined;
    renderer.events.onEnterHexogon.on(e => {
      flags.clearAndSetFlag('hovering', e.hexogon);
    });

    renderer.render(grid);

    return container;
  });
