import { Point } from "../point";
import { Neuron } from "../neuron";
import { Connector } from "../connector/connector";
import { ConnectorArrow } from "../connector/connectorArrow";
import { ConnectorArrowDash } from "../connector/connectorArrowDash";
import { RNN } from "./rnn";
import { Orientation } from "../orientation";

export class RNN_Layer {
	public size: number;
	public parentLayer: RNN_Layer;
	public neurons: Neuron[];
	public y: number;
	public connectors: Connector[];
	constructor(size: number) {
		this.size = size;
		this.parentLayer = null;
		this.neurons = new Array<Neuron>();
		this.y = 150;
		this.connectors = new Array<ConnectorArrow>();
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

	public display(canvas: HTMLCanvasElement, neuralNetwork: RNN): void {
		for (let i = 0; i < this.size; i++) {
			this.neurons[i].display(canvas);
		}
	}

	public createConnectors(indexStep: number, indexLayer: number, neuralNetwork: RNN): void {
		if (this.connectors.length === 0) {
			if(indexLayer > 0) {
				switch(neuralNetwork.orientation) {
					case Orientation.HORIZONTAL:
						this.connectors.push(
							new ConnectorArrow(
								new Point(this.parentLayer.neurons[this.parentLayer.neurons.length-1].x,
									this.parentLayer.neurons[this.parentLayer.neurons.length-1].y + this.parentLayer.getRadius()),
								new Point(this.neurons[0].x,
									this.getY() - this.getRadius())
							)
						);
						if(indexLayer < neuralNetwork.nbLayers-1 && indexStep < neuralNetwork.nbSteps-1) {
							const next_nn = neuralNetwork.steps[indexStep+1][indexLayer];
							this.connectors.push(
								new ConnectorArrow(
									new Point(this.neurons[this.neurons.length-1].x + this.getRadius(),
										this.neurons[this.neurons.length-1].y),
									new Point(next_nn.neurons[next_nn.neurons.length-1].x - this.getRadius(),
									next_nn.neurons[next_nn.neurons.length-1].y)
								)
							);
						}
						break;
					case Orientation.VERTICAL:
						this.connectors.push(
							new ConnectorArrow(
								new Point(this.parentLayer.neurons[this.parentLayer.neurons.length-1].x + this.parentLayer.getRadius(),
									this.parentLayer.neurons[this.parentLayer.neurons.length-1].y),
								new Point(this.neurons[this.neurons.length-1].x - this.getRadius(),
									this.neurons[this.neurons.length-1].y)
							)
						);
						if(indexStep < neuralNetwork.nbSteps-1 && indexLayer < neuralNetwork.nbLayers-1) {
							const next_nn = neuralNetwork.steps[indexStep+1][indexLayer];
							this.connectors.push(
								new ConnectorArrow(
									new Point(this.neurons[0].x,
										this.neurons[0].y + this.getRadius()),
									new Point(next_nn.neurons[0].x,
										next_nn.neurons[0].y - next_nn.getRadius())
								)
							);
						}
					break;
				}
			}
			if(indexLayer === neuralNetwork.nbLayers-1 && indexStep < neuralNetwork.nbSteps-1) {
				const cur_nn = neuralNetwork.steps[indexStep][indexLayer];
				const next_nn = neuralNetwork.steps[indexStep+1][0];
				switch(neuralNetwork.orientation) {
					case Orientation.HORIZONTAL:
						this.connectors.push(
							new ConnectorArrowDash(
								new Point(cur_nn.neurons[0].x + cur_nn.getRadius()/3,
									cur_nn.getY() - cur_nn.getRadius()),
								new Point(next_nn.neurons[next_nn.neurons.length-1].x - next_nn.getRadius()/3,
									next_nn.neurons[next_nn.neurons.length-1].y + next_nn.getRadius())
							)
						);
						break;
					case Orientation.VERTICAL:
						this.connectors.push(
							new ConnectorArrowDash(
								new Point(cur_nn.neurons[0].x - cur_nn.getRadius(),
									cur_nn.getY() + cur_nn.getRadius()),
								new Point(next_nn.neurons[next_nn.neurons.length-1].x + next_nn.getRadius(),
									next_nn.neurons[next_nn.neurons.length-1].y - next_nn.getRadius())
							)
						);
						break;
				}
			}
		}
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