import {storiesOf} from '@storybook/html';
import {HexogonGrid} from "../src/HexogonGrid";
import {SvgRenderer} from "../src/renderers/SvgRenderer";
import {DemoGrid} from "../src/DemoGrid";
import {Hexogon} from "../src/Hexogon";
import {HexogonStateOf} from "../src/typeHelpers";
import {FlagStore} from "../src/FlagStore";
import {LazyCoordinateConstructor} from "../src/coordinates/LazyCoordinateConstructor";
import {CubeCoordinates} from "../src/coordinates/CubeCoordinates";


storiesOf('Features', module)
  .add('Flagstore', () => {
    const container = document.createElement('div');

    const grid = new HexogonGrid();
    const renderer = new SvgRenderer(container, {});
    const flags = new FlagStore();

    grid.initializeHexagonShape([0, 0, 0], 8);

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

    return container;
  })
  .add('Flagstore Example 2', () => {
    const container = document.createElement('div');
    const coordsContainer = document.createElement('div');

    const grid = new HexogonGrid();
    const renderer = new SvgRenderer(container, {});
    const flags = new FlagStore();

    grid.initializeHexagonShape([0, 0, 0], 8);

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
    container.appendChild(coordsContainer);

    return container;
  })
  .add('Bounding Box', () => {
    const container = document.createElement('div');

    const grid = new HexogonGrid();
    const renderer = new SvgRenderer(container, {});

    // grid.initializeHexagonShape([5, 9, -14], 8);
    [[0,-2,2],  [-3,1,2],  [0,1,-1],  [3,-3,0],  [2,-7,5],  [-3,-2,5],  [-2,-3,5],  [-2,-2,4],  [6,-2,-4],  [-2,5,-3],
      [-4,7,-3],  [-3,7,-4],  [-4,8,-4],  [4,-1,-3],  [5,-1,-4],  [4,0,-4],  [1,5,-6],  [-4,4,0],  [-4,3,1],  [-3,2,1]]
      .map(LazyCoordinateConstructor.lazyConstruct)
      .forEach(coordinates => grid.newHexogon({coordinates}, {}));

    renderer.render(grid);

    const {topLeft, bottomRight, width, height} = renderer.getBoundingBox(grid);
    console.log(topLeft, bottomRight, width, height)
    const bb = renderer.createChild('rect');
    bb.setAttribute('width', `${width}`);
    bb.setAttribute('height', `${height}`);
    bb.setAttribute('x', `${topLeft.x}`);
    bb.setAttribute('y', `${topLeft.y}`);
    bb.setAttribute('fill', DemoGrid.colors.primary.bg);
    bb.setAttribute('fill-opacity', '.4');

    return container;
  })
  .add('Visibility', () => {
    const container = document.createElement('div');

    const grid = new HexogonGrid();
    const renderer = new SvgRenderer(container, {});
    const flags = new FlagStore();

    grid.initializeHexagonShape([0, 0, 0], 8);
    flags.setFlag('camera', grid.getHexogonAtCoords(new CubeCoordinates(0, 0, 0)));

    renderer.deriveRenderData = hex => ({
      style: {
        backgroundColor: (
          flags.hasHexogonFlag(hex, 'camera') ? DemoGrid.colors.primary
            : flags.hasHexogonFlag(hex, 'block') ? DemoGrid.colors.tertiary
              : flags.hasHexogonFlag(hex, 'hovering') ? DemoGrid.colors.secondary : DemoGrid.colors.default
        ).bg,
        borderColor: DemoGrid.colors.default.border
      },
      text: flags.hasHexogonFlag(hex, 'hovering')
        ? (
          grid.isVisible(
            flags.getHexogonsWithFlag('camera')[0],
            hex,
            h => flags.hasHexogonFlag(h, 'block')
          ) ? 'visible' : 'blocked'
        )
        : ''
    });

    renderer.events.onEnterHexogon.on(e => {
      flags.clearAndSetFlag('hovering', e.hexogon);
    });

    renderer.events.onClickHexogon.on(e => {
      if (!flags.hasHexogonFlag(e.hexogon, 'camera')) {
        flags.toggle('block', e.hexogon);
      }
    });

    renderer.render(grid);

    return container;
  });
