import { Point } from "./point";

export class Quadrilateral {
	public p1: Point;
    public p2: Point;
    public p3: Point;
    public p4: Point;
	constructor(p1: Point, p2: Point, p4: Point, p3: Point) {
		this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
	}

	public display(canvas: HTMLCanvasElement): void {
		const context = canvas.getContext("2d");
		context.beginPath();
		context.lineWidth = 1;
		context.moveTo(this.p1.x, this.p1.y);
        context.lineTo(this.p2.x, this.p2.y);
        context.lineTo(this.p3.x, this.p3.y);
        context.lineTo(this.p4.x, this.p4.y);
        context.lineTo(this.p1.x, this.p1.y);
		context.strokeStyle = "#124191";
        context.stroke();
        context.fillStyle="#239DF9";
        context.fill();
	}
}