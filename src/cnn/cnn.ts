import { CNN_Layer } from "../cnn/cnn_layer";
import { Neuron } from "../neuron";
import { NeuralNetwork } from "../neuralNetwork";

export class CNN extends NeuralNetwork {
	public layers: CNN_Layer[];
	constructor(canvas: HTMLCanvasElement) {
		super();
		this.canvas = canvas;
		this.layers = new Array<CNN_Layer>();
		this.error = "";
	}

	// Override
	public init(): void {
		this.initLayers(this.canvas);
		this.createConnectors();
	}

	// Override
	public draw(): void {
		const context = this.canvas.getContext("2d");
		context.save();
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.display();
	}

	// Override
	public display(): void {
		for (let i = this.layers.length - 1; i > 0; i--) {
			this.layers[i].display(this.canvas);
			for (let j = 0; j < this.layers[i].connectors.length; j++) {
				this.layers[i].connectors[j].display(this.canvas);
			}
		}
		this.layers[0].display(this.canvas);
	}

	// Override
	public addLayer(nbX, nbY, nbChannels): void {
		try {
			const layer = new CNN_Layer(nbX, nbY, nbChannels);
			this.layers.push(layer);
			this.init();
		}
		catch {
			this.error = "Error: can't add an empty layer";
		}
	}
	
	// Override
	public define(nbNeuronsChannel: Array<Array<number>>) :void {
		for(let i = 0; i < nbNeuronsChannel.length; i++) {
			this.addLayer(nbNeuronsChannel[i][0], nbNeuronsChannel[i][1], nbNeuronsChannel[i][2]);
		}
	}

	public createConnectors(): void {
		for (let i = 1; i < this.layers.length; i++) {
			this.layers[i].createConnectors();
		}
	}

	public initLayers(canvas: HTMLCanvasElement): void {
		for (let iLayer = 0; iLayer < this.layers.length; iLayer++) {
			if (iLayer > 0) {
				this.layers[iLayer].parentLayer = this.layers[iLayer - 1];
				if(this.layers[iLayer].parentLayer.size_y === 1) {
					this.layers[iLayer].y = this.layers[iLayer].parentLayer.y + this.layers[iLayer].parentLayer.height + 150;
				}
				else {
					this.layers[iLayer].y = this.layers[iLayer].parentLayer.y + this.layers[iLayer].parentLayer.height + 60;
				}
			}
			if(!this.layers[iLayer].contracted) {
				for (let j = 0; j < this.layers[iLayer].size_y; j++) {
					this.layers[iLayer].neurons.push(new Array<Neuron>());
					for (let i = 0; i < this.layers[iLayer].size_x; i++) {
						const max_radius = 20;
						const min_radius = 1;
						const displaySize = this.layers[iLayer].contracted ? max_radius : this.layers[iLayer].size_x;
						const canvas_width = canvas.width;
						let gap = 4;
						let neuron_radius = this.layers[iLayer].isLeaf ?
							canvas_width / (this.layers[iLayer].size_x * 2.5) :
							canvas_width / (this.layers[iLayer].size_x * 5);
						neuron_radius = neuron_radius > max_radius ? max_radius : neuron_radius;
						neuron_radius = neuron_radius < min_radius ? min_radius : neuron_radius;
						const free_space = canvas_width - displaySize * (neuron_radius * 2 + gap);
						const offset = this.layers[iLayer].isLeaf ? 2.2 : 1.5;
						this.layers[iLayer].neurons[j].push(
							new Neuron(free_space / 2 + neuron_radius + (i * neuron_radius * offset) + gap + j * (neuron_radius / 4),
								this.layers[iLayer].y + (neuron_radius / 2) * j, neuron_radius, false, ""));
						gap += 4;
					}
				}
				this.layers[iLayer].pos_x = this.layers[iLayer].neurons[0][0].x;
				this.layers[iLayer].pos_y = this.layers[iLayer].neurons[0][0].y;
				this.layers[iLayer].width = this.layers[iLayer].neurons[this.layers[iLayer].size_y-1][this.layers[iLayer].size_x-1].x - this.layers[iLayer].pos_x;
				this.layers[iLayer].height = this.layers[iLayer].neurons[this.layers[iLayer].size_y-1][this.layers[iLayer].size_x-1].y - this.layers[iLayer].pos_y;
			}
			else {
				this.layers[iLayer].pos_x = 300;
				this.layers[iLayer].pos_y = this.layers[iLayer].y;
				this.layers[iLayer].width = 350;
				this.layers[iLayer].height = 150;
			}
		}
		this.layers[0].isRoot = true;
	}

	// Override
	public getNbNeurons(): number {
		let nbNeurons = 0;
		for (let i = 0; i < this.layers.length; i++) {
			nbNeurons += this.layers[i].getNbNeurons();
		}
		return nbNeurons;
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