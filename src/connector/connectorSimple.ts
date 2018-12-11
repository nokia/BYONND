import { Point } from "../point";
import { Connector } from "./connector";

export class ConnectorSimple extends Connector {
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
		context.lineWidth = 1;
		context.moveTo(this.p1.x, this.p1.y);
		context.lineTo(this.p2.x, this.p2.y);
		context.strokeStyle = "#000000";
		context.stroke();
		context.restore();
	}
}