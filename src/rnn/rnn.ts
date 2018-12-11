import { Neuron } from "../neuron";
import { RNN_Layer } from "./rnn_layer";
import { NeuralNetwork } from "../neuralNetwork";
import { Orientation } from "../orientation";

export class RNN extends NeuralNetwork {
	public steps: RNN_Layer[][];
	public layers: RNN_Layer[];
	public nbOutputs: number;
	public cellSize: number;
	public nbLayers: number;
	public seqLen: number;
	public nbSteps: number;
	public serie: Array<string>;
	public contracted: boolean;
	public orientation: Orientation;
	constructor(canvas: HTMLCanvasElement) {
		super();
		this.canvas = canvas;
		this.steps = new Array<Array<RNN_Layer>>();
		this.layers = new Array<RNN_Layer>();
		this.orientation = Orientation.HORIZONTAL;
		this.error = "";
	}

	// Override
	public init(): void {
		this.initLayers(this.canvas);
		this.createConnectors();
	}

	// Override
	public addLayer(nbNeurons: number): void {
		try {
			const layer = new RNN_Layer(nbNeurons);
			this.layers.push(layer);
		}
		catch {
			this.error = "Error: can't add an empty layer";
		}
	}

	// Override
	public define(nbSteps: number, nbLayers: number, serie?: Array<string>, orientation?: string) :void {
		this.nbLayers = nbLayers+2;
		this.contracted = nbSteps > 15;
		this.nbSteps = this.isContracted() ? 15 : nbSteps;
		for(let i = 0; i < this.nbLayers; i++) {
			this.addLayer(3);
		}
		switch(orientation.toLowerCase()) {
			case "horizontal":
				this.orientation = Orientation.HORIZONTAL;
				break;
			case "vertical":
				this.orientation = Orientation.VERTICAL;
				break;
		}
		this.init();
		this.serie = serie;
	}

	// Override
	public draw(): void {
		const context = this.canvas.getContext("2d");
		context.save();
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.display();
	}

	public initLayers(canvas: HTMLCanvasElement): void {
		const honrizontalConnectorSize = 50;
		let gap_step = 4+honrizontalConnectorSize;
		const max_radius = 30;
		const min_radius = 1;
		const displaySize = this.nbSteps;
		const canvas_width = canvas.width;
		let neuron_radius = canvas_width / ((displaySize * 2)) - ((gap_step) / 2) - 1;
		neuron_radius = neuron_radius > max_radius ? max_radius : neuron_radius;
		neuron_radius = neuron_radius < min_radius ? min_radius : neuron_radius;
		const free_space = canvas_width - displaySize * (neuron_radius * 2 + gap_step);
		for (let i = 0; i < this.nbSteps; i++) {
			for (let j = 0; j < this.layers.length; j++) {
				if (this.layers[j].neurons.length === 0) {
					if (j > 0) {
						this.layers[j].parentLayer = this.layers[j - 1];
						this.layers[j].y = this.layers[j].parentLayer.y + 120;
					}
					let gap_layer = 0;
					for(let k = 0; k < this.layers[j].size; k++) {
						switch(this.orientation) {
							case Orientation.HORIZONTAL:
								this.layers[j].neurons.push(new Neuron(free_space / 2 + neuron_radius + (i * neuron_radius * 2) + gap_step - 30,
								this.layers[j].y + gap_layer, neuron_radius, false, ""));
								break;
							case Orientation.VERTICAL:
								this.layers[j].neurons.push(new Neuron(this.layers[j].y,
								free_space / 2 + neuron_radius + (i * neuron_radius * 2) + gap_step + gap_layer - 30, neuron_radius, false, ""));
								break;
						}
						gap_layer += neuron_radius/3;
					}
				}
			}
			gap_step += 4+honrizontalConnectorSize;
			this.steps.push(this.layers);
			this.layers = new Array<RNN_Layer>();
			for(let i = 0; i < this.nbLayers; i++) {
				this.addLayer(3);
			}
		}
	}

	public createConnectors(): void {
		for(let i = 0; i < this.nbSteps; i++) {
			for (let j = 0; j < this.layers.length; j++) {
				this.steps[i][j].createConnectors(i, j, this);
			}
		}
	}

	public displaySteps(): void {
		for(let i = 0; i < this.nbSteps; i++) {
			for (let j = 0; j < this.layers.length; j++) {
				this.steps[i][j].display(this.canvas, this);
			}
		}
	}

	// Override
	public display(): void {
		const context = this.canvas.getContext("2d");
		for(let i = 0; i < this.nbSteps; i++) {
			for (let j = 0; j < this.steps[i].length; j++) {
				for (let k = 0; k < this.steps[i][j].connectors.length; k++) {
					this.steps[i][j].connectors[k].display(this.canvas);
				}
			}
		}
		this.displaySteps();
		
		if(this.serie != null) {
			if(this.nbSteps+1 === this.serie.length) {
				switch(this.orientation) {
					case Orientation.HORIZONTAL:
						for(let i = 0; i < this.nbSteps; i++) {
							context.font = "30px Arial";
							context.fillText(this.serie[i], this.steps[i][0].neurons[0].x-10, this.steps[i][0].neurons[0].y-40);
							context.fillText("t="+i, this.steps[i][0].neurons[0].x-20, this.steps[i][0].neurons[0].y-90);
						}
						for(let i = 1; i <= this.nbSteps; i++) {
							context.font = "30px Arial";
							context.fillText(this.serie[i], this.steps[i-1][0].neurons[0].x-10, this.steps[i-1][this.nbLayers-1].neurons[0].y+80);
						}
						break;
					case Orientation.VERTICAL:
						for(let i = 0; i < this.nbSteps; i++) {
							context.font = "30px Arial";
							const lastNeuron = this.steps[i][0].neurons[this.steps[i][0].neurons.length-1];
							context.fillText(this.serie[i], lastNeuron.x-60, lastNeuron.y);
							context.fillText("t="+i, lastNeuron.x-120, lastNeuron.y);
						}
						for(let i = 1; i <= this.nbSteps; i++) {
							context.font = "30px Arial";
							const lastNeuron = this.steps[i-1][this.nbLayers-1].neurons[this.steps[i-1][this.nbLayers-1].neurons.length-1];
							context.fillText(this.serie[i], lastNeuron.x+60, lastNeuron.y);
						}
						break;
				}
			}
			else {
				if(this.isContracted()) {
					console.error("Can't display serie data in a contracted view (serie length > 15)");
				}
				else {
					console.error("The (nb steps+1) and the serie length must be equal");
				}
			}
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
		return this.contracted;
	}

	// Override
	public getError(): string {
		return this.error;
	}

}