import { Neuron } from "../neuron";
import { MLP_Layer } from "./mlp_layer";
import { NeuralNetwork } from "../neuralNetwork";

export class MLP extends NeuralNetwork {

	public layers: MLP_Layer[];
	constructor(canvas: HTMLCanvasElement) {
		super();
		this.canvas = canvas;
		this.layers = new Array<MLP_Layer>();
		this.error = "";
	}

	// Override
	public init(): void {
		this.initLayers(this.canvas);
		this.balanceRadius();
		this.createConnectors();
	}

	// Override
	public addLayer(nbNeurons: number): void {
		try {
			const layer = new MLP_Layer(nbNeurons);
			this.layers.push(layer);
			this.init();
		}
		catch {
			this.error = "Error: can't add an empty layer";
		}
	}

	// Override
	public define(nbNeurons: Array<number>) :void {
		for(let i = 0; i < nbNeurons.length; i++) {
			this.addLayer(nbNeurons[i]);
		}
	}

	// Override
	public draw(): void {
		const context = this.canvas.getContext("2d");
		context.save();
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.display();
	}

	public initLayers(canvas: HTMLCanvasElement): void {
		for (let j = 0; j < this.layers.length; j++) {
			if (this.layers[j].neurons.length === 0) {
				if (j > 0) {
					this.layers[j].parentLayer = this.layers[j - 1];
					this.layers[j].y = this.layers[j].parentLayer.y + 150;
				}
				const max_radius = 30;
				const min_radius = 1;
				const displaySize = this.layers[j].contracted ? max_radius : this.layers[j].size;
				const canvas_width = canvas.width;
				let gap = 4;
				let neuron_radius = canvas_width / ((displaySize * 2)) - (gap / 2) - 1;
				neuron_radius = neuron_radius > max_radius ? max_radius : neuron_radius;
				neuron_radius = neuron_radius < min_radius ? min_radius : neuron_radius;
				const free_space = canvas_width - displaySize * (neuron_radius * 2 + gap);
				if (!this.layers[j].contracted) {
					for (let i = 0; i < displaySize; i++) {
						this.layers[j].neurons.push(new Neuron(free_space / 2 + neuron_radius + (i * neuron_radius * 2) + gap,
							this.layers[j].y, neuron_radius, false, ""));
						gap += 4;
					}
				}
				else {
					for (let i = 0; i < 4; i++) {
						this.layers[j].neurons.push(new Neuron(free_space / 2 + neuron_radius + (i * neuron_radius * 2) + gap,
							this.layers[j].y, neuron_radius, false, ""));
						gap += 8;
					}
					for (let i = 0; i < 4; i++) {
						this.layers[j].neurons.push(new Neuron(canvas_width - free_space / 2 - neuron_radius - (i * neuron_radius * 2) - gap + 40,
							this.layers[j].y, neuron_radius, false, ""));
						gap += 8;
					}
				}
			}
		}
	}

	public balanceRadius(): void {
		let min_radius = this.layers[0].getRadius();
		for (let i = 1; i < this.layers.length; i++) {
			if (min_radius > this.layers[i].getRadius()) {
				min_radius = this.layers[i].getRadius();
			}
		}
		for (let i = 0; i < this.layers.length; i++) {
			this.layers[i].setRadius(min_radius);
		}
	}

	public createConnectors(): void {
		for (let i = 1; i < this.layers.length; i++) {
			this.layers[i].createConnectors();
		}
	}

	// Override
	public display(): void {
		for (let i = 1; i < this.layers.length; i++) {
			for (let j = 0; j < this.layers[i].connectors.length; j++) {
				this.layers[i].connectors[j].display(this.canvas);
			}
		}
		for (let i = 0; i < this.layers.length; i++) {
			this.layers[i].display(this.canvas);
		}
	}

	// Override
	public getNbNeurons(): number {
		let nbNeurons = 0;
		for (let i = 0; i < this.layers.length; i++) {
			nbNeurons += this.layers[i].getNbNeurons();
		}
		return nbNeurons;
	}

	public activateLayerNextNeuron(layerIndex: number): boolean {
		layerIndex = layerIndex % this.layers.length;
		return this.layers[layerIndex].activateNextNeuron();
	}

	public activateLayerNeuron(layerIndex: number, neuronIndex: number): void {
		layerIndex = layerIndex % this.layers.length;
		this.layers[layerIndex].activateNeuron(neuronIndex);
	}

	public activateOutputNeuron(neuronIndex: number): void {
		this.layers[this.layers.length - 1].activateNeuron(neuronIndex);
	}

	public disableLayer(layerIndex: number) {
		layerIndex = layerIndex % this.layers.length;
		this.layers[layerIndex].disable();
	}

	// Override
	public getNbLayers(): number {
		return this.layers.length;
	}

	// Override
	public isContracted(): boolean {
		for (let i = 0; i < this.layers.length; i++) {
			if (this.layers[i].contracted) {
				return true;
			}
		}
		return false;
	}

	// Override
	public getError(): string {
		return this.error;
	}

}