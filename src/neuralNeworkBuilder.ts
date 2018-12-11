import { NeuralNetwork } from "./neuralNetwork";
import { MLP } from "./mlp/mlp";
import { CNN } from "./cnn/cnn";
import { RNN } from "./rnn/rnn";

export class NeuralNetworkBuilder {
	public canvas: HTMLCanvasElement;
	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
	}

	public build(type: string): NeuralNetwork {
		switch(type) {
			case "mlp":
				return new MLP(this.canvas);
				break;
			case "cnn":
				return new CNN(this.canvas);
				break;
			case "rnn":
				return new RNN(this.canvas);
				break;
			default:
				return null;
				break;
		}
	}
}