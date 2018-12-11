import { Point } from "../point";
import { Connector } from "./connector";

export class ConnectorArrowDash extends Connector {
	public p1: Point;
	public p2: Point;
	constructor(p1: Point, p2: Point) {
		super(p1, p2);
	}

	// Override
	public display(canvas: HTMLCanvasElement): void {
		const context = canvas.getContext("2d");
		context.save();
		context.beginPath();
		const headlen = 10;
		const angle = Math.atan2(this.p2.y - this.p1.y, this.p2.x - this.p1.x);
		context.setLineDash([5, 15]);
		context.moveTo(this.p1.x, this.p1.y);
		context.lineTo(this.p2.x, this.p2.y);
		context.stroke();
		context.restore();
		context.save();
		context.beginPath();
		context.moveTo(this.p2.x, this.p2.y);
		context.lineTo(this.p2.x - headlen * Math.cos(angle - Math.PI / 6), this.p2.y - headlen * Math.sin(angle - Math.PI / 6));
		context.moveTo(this.p2.x, this.p2.y);
		context.lineTo(this.p2.x - headlen * Math.cos(angle + Math.PI / 6), this.p2.y - headlen * Math.sin(angle + Math.PI / 6));
		context.stroke();
		context.restore();
	}
}