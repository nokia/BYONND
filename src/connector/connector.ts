import { Point } from "../point";

export abstract class Connector {
	public p1: Point;
	public p2: Point;
	constructor(p1: Point, p2: Point) {
		this.p1 = p1;
		this.p2 = p2;
	}

	public display(canvas: HTMLCanvasElement) {}
}