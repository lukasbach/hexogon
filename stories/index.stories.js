import {document, console} from 'global';
import {storiesOf} from '@storybook/html';
import {Hexogon} from "../src/Hexogon";
import {CubeCoordinates} from "../src/coordinates/CubeCoordinates";
import {PixelPosition} from "../src/PixelPosition";
import {HexogonGrid} from "../src/HexogonGrid";
import {Orientation} from "../src/options/Orientation";
import {DemoGrid} from "../src/DemoGrid";
import {CanvasRenderer} from "../src/renderers/CanvasRenderer";
import {SvgRenderer} from "../src/renderers/SvgRenderer";

const drawHex = (ctx, corners, color) => {
    const [firstCorner, ...otherCorners] = corners;
    ctx.beginPath();
    ctx.moveTo(...firstCorner.arr);
    otherCorners.forEach(c => ctx.lineTo(...c.arr));
    ctx.lineTo(...firstCorner.arr);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
};

storiesOf('Examples', module)
    .add('Example with custom canvas rendering', () => {
        const canvas = document.createElement('canvas');
        canvas.style['image-rendering'] = 'pixelated'
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext("2d");
        const grid = new HexogonGrid({
            offset: new PixelPosition(0, 0),
            spacing: 0,
            defaultHexogonState: {hovering: false},
            orientation: Orientation.Pointy
        }, []);
        grid.initializeRhombusShape([0, 0], 10, 10);
        grid.getAllHexogons().forEach(h => drawHex(ctx, h.corners, '#eee'));

        let hoveringHex = null;

        canvas.onmousemove = e => {
            const [x, y] = [e.offsetX, e.offsetY];
            if (hoveringHex) {
                drawHex(ctx, hoveringHex.corners, '#eee');
            }
            hoveringHex = grid.getHexogonAtPixelCoords(new PixelPosition(x, y));
            if (hoveringHex) {
                drawHex(ctx, hoveringHex.corners, '#ff0000');
            }
        }

        return canvas;
    })
    .add('Demo Grid', () => {
        const canvas = document.createElement('canvas');
        canvas.style['image-rendering'] = 'pixelated';
        canvas.width = 800;
        canvas.height = 800;
        const demo = new DemoGrid(canvas);
        demo.grid.getAllHexogons().forEach(h => h.setState({ text: h.coordinates.toString() }))
        // demo.grid.getHexogonAtPixelCoords(new PixelPosition(120, 100)).setState({ color: DemoGrid.colors.primary })
        return canvas;
    })
    .add('Neighbours', () => {
        const canvas = document.createElement('canvas');
        canvas.style['image-rendering'] = 'pixelated';
        canvas.width = 800;
        canvas.height = 800;
        const demo = new DemoGrid(canvas);

        let neighbours = [];
        demo.grid.events.hexogonStateChange.on(({ changedHexogon, changedState, oldState }) => {
            if (changedState.isHovering && !oldState.isHovering) {
                neighbours.forEach(n => n.setState({ color: undefined }));
                neighbours = demo.grid.getNeighboursOfHexogon(changedHexogon);
                for (const neighbour of neighbours) {
                    if (neighbour) {
                        neighbour.setState({ color: DemoGrid.colors.secondary });
                    }
                }
            }
        });

        return canvas;
    })
    .add('Diagonal Neighbours', () => {
        const canvas = document.createElement('canvas');
        canvas.style['image-rendering'] = 'pixelated';
        canvas.width = 800;
        canvas.height = 800;
        const demo = new DemoGrid(canvas);

        let neighbours = [];
        demo.grid.events.hexogonStateChange.on(({ changedHexogon, changedState, oldState }) => {
            if (changedState.isHovering && !oldState.isHovering) {
                neighbours.forEach(n => n.setState({ color: undefined }));
                neighbours = demo.grid.getDiagonalNeighboursOfHexogon(changedHexogon);
                for (const neighbour of neighbours) {
                    if (neighbour) {
                        neighbour.setState({ color: DemoGrid.colors.secondary });
                    }
                }
            }
        });

        return canvas;
    })
    .add('Distance', () => {
        const canvas = document.createElement('canvas');
        canvas.style['image-rendering'] = 'pixelated';
        canvas.width = 800;
        canvas.height = 800;
        const demo = new DemoGrid(canvas);

        const reference = demo.grid.getHexogonAtCoords(new CubeCoordinates(8, 3, -11));
        reference.setState({ color: DemoGrid.colors.primary });

        let hovering = null;

        demo.grid.events.hexogonStateChange.on(({ changedHexogon, changedState, oldState }) => {
            if (changedState.isHovering && !oldState.isHovering) {
                if (hovering) {
                    hovering.setState({ text: undefined });
                }
                hovering = changedHexogon;

                const dist = hovering.distanceTo(reference);

                hovering.setState({ text: dist });
            }
        });

        return canvas;
    })
    .add('Straight line interpolation', () => {
        const canvas = document.createElement('canvas');
        canvas.style['image-rendering'] = 'pixelated';
        canvas.width = 800;
        canvas.height = 800;
        const demo = new DemoGrid(canvas);

        const reference = demo.grid.getHexogonAtCoords(new CubeCoordinates(8, 3, -11));
        reference.setState({ color: DemoGrid.colors.primary });

        let hovering = null;
        let line = [];

        demo.grid.events.hexogonStateChange.on(({ changedHexogon, changedState, oldState }) => {
            if (changedState.isHovering && !oldState.isHovering) {
                if (line) {
                    for (const hex of line) {
                        hex.setState({ color: undefined });
                    }
                }

                hovering = changedHexogon;

                for (const hex of demo.grid.interpolateLineToHexogons(reference, hovering)) {
                    hex.setState({ color: DemoGrid.colors.secondary });
                    line.push(hex);
                }
            }
        });

        return canvas;
    })
    .add('Hexogons in range', () => {
        const canvas = document.createElement('canvas');
        canvas.style['image-rendering'] = 'pixelated';
        canvas.width = 800;
        canvas.height = 800;
        const demo = new DemoGrid(canvas);

        let hovering = null;
        let hexsInRange = [];

        demo.grid.events.hexogonStateChange.on(({ changedHexogon, changedState, oldState }) => {
            if (changedState.isHovering && !oldState.isHovering) {
                if (hexsInRange) {
                    hexsInRange.forEach(h => h.setState({ color: undefined }));
                }

                hovering = changedHexogon;

                hexsInRange = demo.grid.getHexogonsInRange(hovering, 3);
                console.log(hexsInRange.length, hovering);
                hexsInRange.forEach(h => h.setState({ color: DemoGrid.colors.secondary }))
            }
        });

        return canvas;
    })
    .add('Rotating coordinates', () => {
        const canvas = document.createElement('canvas');
        canvas.style['image-rendering'] = 'pixelated';
        canvas.width = 800;
        canvas.height = 800;
        const demo = new DemoGrid(canvas);

        let hovering = null;
        let reference = null;
        let left = null;
        let right = null;

        demo.grid.events.hexogonStateChange.on(({ changedHexogon, changedState, oldState }) => {
            if (changedState.isHovering && !oldState.isHovering) {
                if (reference) { reference.setState({ color: undefined, text: undefined }); }
                if (left) { left.setState({ color: undefined, text: undefined }); }
                if (right) { right.setState({ color: undefined, text: undefined }); }

                hovering = changedHexogon;
                reference = demo.grid.getHexogonAtCoords(hovering.coordinates.clone().add([3, 0, -3]));
                left = demo.grid.getHexogonAtCoords(hovering.coordinates.clone().toCubeCoordinates().rotateLeft(reference.coordinates));
                right = demo.grid.getHexogonAtCoords(hovering.coordinates.clone().toCubeCoordinates().rotateRight(reference.coordinates));

                if (reference) reference.setState({ color: DemoGrid.colors.primary, text: 'reference' });
                if (left) left.setState({ color: DemoGrid.colors.secondary, text: '-60°' });
                if (right) right.setState({ color: DemoGrid.colors.tertiary, text: '+60°' });
            }
        });

        return canvas;
    })
    .add('Canvas Renderer', () => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 800;

        const grid = new HexogonGrid({});
        grid.initializeHexagonShape([5, 9, -14], 8);
        const renderer = new CanvasRenderer(canvas, {});
        renderer.renderOnce(grid);

        return canvas;
    })
    .add('SVG Renderer', () => {
        const container = document.createElement('div');

        const grid = new HexogonGrid({});
        grid.initializeHexagonShape([5, 9, -14], 8);
        const renderer = new SvgRenderer(container, {});
        renderer.renderOnce(grid);
        renderer.svg.setAttribute('width', '800');
        renderer.svg.setAttribute('height', '800');

        return container;
    });
