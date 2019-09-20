import {storiesOf} from '@storybook/html';
import {HexogonGrid} from "../src/HexogonGrid";
import {SvgRenderer} from "../src/renderers/SvgRenderer";
import {DemoGrid} from "../src/DemoGrid";
import {Hexogon} from "../src/Hexogon";
import {HexogonStateOf} from "../src/typeHelpers";


storiesOf('SVG Renderer', module)
  .add('Minimalistic Example', () => {
    const container = document.createElement('div');

    const grid = new HexogonGrid({});
    grid.initializeHexagonShape([5, 9, -14], 8);
    const renderer = new SvgRenderer(container, {});
    renderer.render(grid);
    renderer.svg.setAttribute('width', '800');
    renderer.svg.setAttribute('height', '800');

    return container;
  })
  .add('Hovering Example', () => {
    const container = document.createElement('div');

    const grid = new HexogonGrid<{ hovering: boolean }>({ defaultHexogonState: {hovering: false} });
    grid.initializeHexagonShape([5, 9, -14], 8);

    const renderer = new SvgRenderer<HexogonStateOf<typeof grid>>(container, {});

    renderer.deriveRenderData = hex => ({
      style: {
        backgroundColor: (hex.state.hovering ? DemoGrid.colors.secondary : DemoGrid.colors.primary).bg,
        borderColor: DemoGrid.colors.primary.border
      }
    });

    let hovering: Hexogon | undefined;
    renderer.events.onEnterHexogon.on(e => {
      if (hovering) hovering.setState({ hovering: false });
      hovering = e.hexogon;
      hovering.setState({ hovering: true });
    });

    renderer.render(grid);
    renderer.svg.setAttribute('width', '800');
    renderer.svg.setAttribute('height', '800');

    return container;
  });
