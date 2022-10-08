interface HeatmapData {
	x: number;
	y: number;
	value: number;
}

export default class Heatmap {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	data: HeatmapData[];

	brushSize: number;
	brushBlur: number;
	brushCanvas: HTMLCanvasElement;
	gradientPixels: Uint8ClampedArray;
	overlayCanvas: HTMLCanvasElement;

	renderScale: number;

	constructor() {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		this.renderScale = 3;

		this.canvas.width = 1024 / this.renderScale;
		this.canvas.height = 1024 / this.renderScale;

		this.data = [];

		this.brushSize = 25 / this.renderScale;
		this.brushBlur = 25 / this.renderScale;

		this.createBrush();
		this.createGradientMap();
	}

	setData(data: HeatmapData[]) {
		this.data = data.map((data) => ({ x: data.x / this.renderScale, y: data.y / this.renderScale, value: data.value }));

		this.render();
	}

	addData(data: HeatmapData) {
		this.data.push({ x: data.x / this.renderScale, y: data.y / this.renderScale, value: data.value });

		this.render();
	}

	render() {
		const { width, height } = this.canvas;

		this.ctx.clearRect(0, 0, width, height);

		this.data.forEach((data) => {
			const { x, y, value } = data;

			const radius = this.brushSize + this.brushBlur;

			this.ctx.globalAlpha = value;
			this.ctx.drawImage(this.brushCanvas, x - radius, y - radius);
		});

		const imageData = this.ctx.getImageData(0, 0, width, height);
		const pixels = imageData.data;
		let length = pixels.length / 4;

		while (length--) {
			var id = length * 4 + 3;
			var alpha = pixels[id] / 256;

			var colorOffset = Math.floor(alpha * (256 - 1));
			pixels[id - 3] = this.gradientPixels[colorOffset * 4];     // red
			pixels[id - 2] = this.gradientPixels[colorOffset * 4 + 1]; // green
			pixels[id - 1] = this.gradientPixels[colorOffset * 4 + 2]; // blue
		}

		this.ctx.putImageData(imageData, 0, 0);
	}

	createBrush() {
		const brush: HTMLCanvasElement = document.createElement('canvas');

		const radius = this.brushSize + this.brushBlur;
		const diameter = radius * 2;

		brush.width = diameter;
		brush.height = diameter;

		const ctx = brush.getContext('2d');
		ctx.shadowOffsetX = diameter;
		ctx.shadowBlur = this.brushBlur;
		ctx.shadowColor = 'black';

		ctx.beginPath();
		ctx.arc(-radius, radius, this.brushSize, 0, 2 * Math.PI, true);
		ctx.closePath();
		ctx.fill();

		this.brushCanvas = brush;
	}

	createGradientMap() {
		const gradientMap: HTMLCanvasElement = document.createElement('canvas');		

		gradientMap.width = 1;
		gradientMap.height = 256;

		const ctx = gradientMap.getContext('2d');

		const gradientColors = {
			0.5: 'blue',
			0.6: 'cyan',
			0.8: 'lime',
			0.9: 'yellow',
			1.0: 'red'
		}

		const gradient = ctx.createLinearGradient(0, 0, 0, 256);
		for (const [stop, color] of Object.entries(gradientColors)) {
			gradient.addColorStop(parseFloat(stop), color);
		}

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, 1, 256);

		this.gradientPixels = ctx.getImageData(0, 0, 1, 256).data;
	}

	toDataURL() {
		return this.canvas.toDataURL();
	}
}
