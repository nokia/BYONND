import { Orientation } from "./orientation";

export abstract class NeuralNetwork {
	public canvas: HTMLCanvasElement;
	public error: string;

	public abstract init(): void;

	public abstract addLayer(x?: number, y?: number, c?: number): void;

	public abstract define(nb: number|Array<number>|Array<Array<number>>,
			nbLayers?: number, data?: Array<string>, orientation?: Orientation) :void;

	public abstract draw(): void;

	public abstract display(): void;

	public abstract getNbNeurons(): number;

	public abstract getNbLayers(): number;

	public abstract isContracted(): boolean;

	public abstract getError(): string;
}