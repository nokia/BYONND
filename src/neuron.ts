export class Neuron {
	public x: number;
	public y: number;
	public radius: number;
	public active: boolean;
	public value: string;
	public hovered: boolean;
	constructor(x: number, y: number, radius: number,
				active: boolean, value: string, hovered?: boolean) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.active = active;
		this.value = value;
		this.hovered = hovered;
	}

	public display(canvas: HTMLCanvasElement): void {
		const context = canvas.getContext("2d");
		context.beginPath();
		context.fillStyle = this.active ? "#FFBF02" : "#239DF9";
		context.lineWidth = 2;
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		context.strokeStyle = this.active ? "#FF7900" : "#124191";
		context.stroke();
		context.fill();
		context.font = (this.radius) + "px Arial";
		context.fillStyle = "#124191";
		const value = this.value === "" ? "" : this.value[0];
		context.fillText(value, this.x - this.radius / 3, this.y + this.radius / 4);
	}

	public activate(): void {
		this.active = true;
	}

	public disable(): void {
		this.active = false;
	}

	public collision(x: number, y: number): boolean {
		const dx = x - this.x;
		const dy = y - this.y;
		return ((dx * dx) / (this.radius * this.radius) + (dy * dy) /
				(this.radius * this.radius) <= 1);
	}
}