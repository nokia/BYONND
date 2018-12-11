import { Connector } from "../connector/connector";
import { Point } from "../point";
import { Neuron } from "../neuron";
import { ConnectorSimple } from "../connector/connectorSimple";

export class MLP_Layer {
	public size: number;
	public contracted: boolean;
	public parentLayer: MLP_Layer;
	public neurons: Neuron[];
	public y: number;
	public connectors: Connector[];
	constructor(size: number) {
		this.size = size;
		this.contracted = this.size > 60 ? true : false;
		this.parentLayer = null;
		this.neurons = new Array<Neuron>();
		this.y = 100;
		this.connectors = new Array<Connector>();
	}

	public getRadius(): number {
		return this.neurons[0].radius;
	}

	public setRadius(newRadius: number) {
		for (let i = 0; i < this.neurons.length; i++) {
			this.neurons[i].radius = newRadius;
		}
	}

	public getX(): number {
		return this.neurons[0].x;
	}

	public getY(): number {
		return this.neurons[0].y;
	}

	public getNbNeurons(): number {
		return this.size;
	}

	public display(canvas: HTMLCanvasElement): void {
		const context = canvas.getContext("2d");
		if (!this.contracted) {
			for (let i = 0; i < this.size; i++) {
				this.neurons[i].display(canvas);
			}
		}
		else {
			const canvas_width = canvas.width;
			for (let i = 0; i < this.neurons.length; i++) {
				this.neurons[i].display(canvas);
			}
			context.font = "30px Arial";
			const text = ". . . . . " + this.size + " neurons . . . . .";
			context.fillText(text, canvas_width / 2 - text.length * 6, this.getY() + this.getRadius() / 2);
		}
	}

	public createConnectors(): void {
		if (this.connectors.length === 0) {
			if (!this.contracted && !this.parentLayer.contracted) {
				this.connectors = Array();
				for (let i = 0; i < this.parentLayer.size; i++) {
					for (let j = 0; j < this.size; j++) {
						this.connectors.push(
							new ConnectorSimple(
								new Point(this.neurons[j].x,
									this.getY() - this.getRadius()),
								new Point(this.parentLayer.neurons[i].x,
									this.parentLayer.getY() + this.parentLayer.getRadius())
							)
						);
					}
				}
			}
			else {
				for (let i = 0; i < 11; i++) {
					for (let j = 0; j < 11; j++) {
						this.connectors.push(
							new ConnectorSimple(
								new Point(50 + i * 101,
									this.getY() - this.getRadius() - 5),
								new Point(50 + j * 101,
									this.parentLayer.getY() - this.parentLayer.getRadius() + 35)
							)
						);
					}
				}
			}
		}
	}

	public activateNextNeuron(): boolean {
		if (!this.contracted) {
			let neuronIndex = -1;
			let i = 0;
			let found = false;
			while (i < this.neurons.length && !found) {
				if (this.neurons[i].active) {
					neuronIndex = i;
					found = true;
				}
				i++;
			}
			if (neuronIndex === -1) {
				this.neurons[0].activate();
				return true;
			}
			else {
				this.neurons[neuronIndex].disable();
				if (neuronIndex === this.neurons.length - 1) {
					this.neurons[0].activate();
					return false;
				}
				else {
					this.neurons[neuronIndex + 1].activate();
					return true;
				}
			}
		}
		return true;
	}

	public activateNeuron(index: number) {
		index = index % this.neurons.length;
		for (let i = 0; i < this.neurons.length; i++) {
			this.neurons[i].disable();
		}
		this.neurons[index].activate();
	}

	public disable(): void {
		for (let i = 0; i < this.neurons.length; i++) {
			this.neurons[i].disable();
		}
	}
}