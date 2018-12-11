import { Neuron } from "../neuron";
import { Connector } from "../connector/connector";
import { ConnectorSimple } from "../connector/connectorSimple";
import { Point } from "../point";
import { Quadrilateral } from "../quadrilateral";

export class CNN_Layer {
	public size_x: number;
	public size_y: number;
	public nbChannels: number;
	public isRoot: boolean;
	public isLeaf: boolean;
	public contracted: boolean;
	public parentLayer: CNN_Layer;
	public neurons: Neuron[][];
	public y: number;
	public connectors: ConnectorSimple[];
	public pos_x: number;
	public pos_y: number;
	public width: number;
	public height: number;
	constructor(size_x: number, size_y?: number, nbChannels?: number) {
		this.size_x = size_x;
		this.size_y = size_y == null ? 1 : size_y;
		this.nbChannels = nbChannels == null ? 0 : nbChannels;
		this.isLeaf = this.size_y === 1 && this.nbChannels === 0 ? true : false;
		this.contracted = (	this.size_x > 60 ||
							this.size_y > 60 ) ? true : false;
		this.parentLayer = null;
		this.neurons = new Array<Array<Neuron>>();
		this.y = 100;
		this.connectors = new Array<ConnectorSimple>();
	}

	public createConnectors(): void {
		if (this.connectors.length === 0) {
			this.connectors = Array();
			if(this.size_y > 1 || this.parentLayer.size_y > 1) {
				for (let i = 0; i < 3; i++) {
					for (let j = 0; j < 3; j++) {
						this.connectors.push(
							new ConnectorSimple(
								new Point((this.pos_x+(this.width/2)),
									(this.pos_y+this.height/2)),
								new Point((this.parentLayer.pos_x+(this.parentLayer.width/2)-this.parentLayer.width/4+this.parentLayer.width/4*i),
									(this.parentLayer.y+this.parentLayer.height/2)-this.parentLayer.height/4+this.parentLayer.height/4*j)
							)
						);
					}
				}
			}
			else {
				if(this.parentLayer.getNbNeurons() > 25 || this.getNbNeurons() > 25) {
					for (let i = 0; i < 11; i++) {
						for (let j = 0; j < 11; j++) {
							this.connectors.push(
								new ConnectorSimple(
									new Point(50 + i * 95,
										this.getY() - this.getRadius() - 5),
									new Point(50 + j * 95,
										this.parentLayer.getY() - this.parentLayer.getRadius() + 35)
								)
							);
						}
					}
				}
				else {
					for (let i = 0; i < this.parentLayer.getNbNeurons(); i++) {
						for (let j = 0; j < this.getNbNeurons(); j++) {
							this.connectors.push(
								new ConnectorSimple(
									new Point(this.neurons[0][j].x,
										this.getY() - this.getRadius()),
									new Point(this.parentLayer.neurons[0][i].x,
										this.parentLayer.getY() + this.parentLayer.getRadius())
								)
							);
						}
					}
				}
			}
		}
	}

	public display(canvas: HTMLCanvasElement): void {
		const context = canvas.getContext("2d");
		if (!this.contracted) {
			for (let j = 0; j < this.size_y; j++) {
				for (let i = 0; i < this.size_x; i++) {
					this.neurons[j][i].display(canvas);
				}
			}
		}
		else {
			const condensed_layer = new Quadrilateral(	new Point(this.pos_x, this.pos_y),
														new Point(this.pos_x+this.width, this.pos_y),
														new Point(this.pos_x+60, this.pos_y+this.height),
														new Point(this.pos_x+this.width+60, this.pos_y+this.height));
			condensed_layer.display(canvas);
		}
		if(!this.isLeaf) {
			context.font = "20px Arial";
			context.fillStyle = "#124191";
			let text = this.size_x + " x "+this.size_y;
			context.fillText(text, this.pos_x-100, this.pos_y+30);
			context.font = "30px Arial";
			context.fillStyle = "#124191";
			text = "X "+this.nbChannels;
			context.fillText(text, this.pos_x+this.width+50, this.pos_y+(this.height/2));
		}
	}

	public getNbNeurons(): number {
		return this.size_x*this.size_y;
	}

	public getX(): number {
		return this.neurons[0][0].x;
	}

	public getY(): number {
		return this.neurons[0][0].y;
	}

	public getRadius(): number {
		return this.neurons[0][0].radius;
	}

	public setRadius(newRadius: number) {
		for (let i = 0; i < this.size_y; i++) {
			for (let j = 0; j < this.size_x; j++) {
				this.neurons[i][j].radius = newRadius;
			}
		}
	}

}