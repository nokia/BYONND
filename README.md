# byonnd-design

Build Your Own Neural Newtork Design<br/>
Vanilla Javascript graphic library to design neural networks on HTML5 canvas<br/><br/>
This designer can handle 3 types of neural networks:
* Multilayer Perceptrons (MLP)
* Convolutional Neural Networks (CNN)
* Recurrent Neural Network (RNN)
<br/><br/>

## How to use?
The only thing you need is an HTML Canvas:

### Declare your canvas

```
<canvas id="canvas" width="1100" height="1200" style="background-color: white;"></canvas>
```
Then, you can instantiate your neural network builder by passing the canvas as parameter:

### Instanciate your neural network builder

```
let neuralNetworkBuilder = new NeuralNetworkBuilder(canvas);
```
You're now ready to design any kind of neural network among those mentioned above.


## Multilayer Perceptron (MLP)
First step, instantiate your new neural network:
```
let neuralNetwork = neuralNetworkBuilder.build("mlp");
```
Then, you have two choices. The argument of the function **addLayer** is the numer of neurons for each layer

### Add layers separately
```
neuralNetwork.addLayer(25);
neuralNetwork.addLayer(20);
neuralNetwork.addLayer(15);
neuralNetwork.addLayer(10);
neuralNetwork.addLayer(5);
```
### Define all layers in one line
```
neuralNetwork.define([25, 20, 15, 10, 5]);
```
When your neural network is ready, you can draw it to your canvas
### Draw neural network
```
neuralNetwork.draw();
```
### Here's the result:
![mlp1](http://sebferrer.fr/byonndimgs/mlp1.png)
### Assign values to neurons
You can assign values to neuron using its **value** parameter:

```
let input_array = "1000101010001000101010001";
for(let i = 0; i < input_array.length; i++) {
    neuralNetwork.layers[0].neurons[i].value = input_array[i];
}
let output_array = "ABCDE";
for(let i = 0; i < output_array.length; i++) {
    neuralNetwork.layers[neuralNetwork.getNbLayers()-1].neurons[i].value = output_array[i];
}
```
In this example, we assign values to the input neurons and the output neurons.
![mlp2](http://sebferrer.fr/byonndimgs/mlp2.png)
## Convolutional Neural Network (CNN)
First step, instantiate your new neural network:
```
let neuralNetwork = neuralNetworkBuilder.build("cnn");
```
Then, you have two choices. The arguments of the function **addLayer** are:
* x - dimension
* y - dimension
* Number of channels

### Add layers separately
```
neuralNetwork.addLayer(50, 50, 2);
neuralNetwork.addLayer(25, 25, 4);
neuralNetwork.addLayer(12, 12, 8);
neuralNetwork.addLayer(6, 6, 12);
neuralNetwork.addLayer(36);
neuralNetwork.addLayer(26);
```
### Define all layers in one line
```
neuralNetwork.define([[50, 50, 2], [25, 25, 4], [12, 12, 8], [6, 6, 12], [36, 1, 0], [26, 1, 0]]);
```
### Activate a neuron
You can also activate a neuron in your drawing by the **activate** function:
```
neuralNetwork.layers[neuralNetwork.layers.length-1].neurons[0][2].activate();
```
In this example, we activate the third neuron of the last layer, the output layer.<br/>
When your neural network is ready, you can draw it to your canvas

### Draw neural network
```
neuralNetwork.draw();
```
### Here's the result:
![cnn](http://sebferrer.fr/byonndimgs/cnn1.png)

## Recurrent Neural Network (RNN)
First step, instantiate your new neural network:
```
let neuralNetwork = neuralNetworkBuilder.build("rnn");
```
Then, you have define your neural network with the **define** function. The arguments are:
* The length of the serie you want to display
* The number of layers bewteen the input layer and the output layer
* (optional) The data serie you want to display to illustrate your neural network

### Define the RNN horizontally
```
neuralNetwork.define(10, 2, ["h","e","l","l","o","w","o","r","l","d","!"]);
```
When your neural network is ready, you can draw it to your canvas. By default it draws it horizontally.
### Draw neural network
```
neuralNetwork.draw();
```
### Here's the result:
![rnn](http://sebferrer.fr/byonndimgs/rnn1.png)

To change the orientation of the neural network, just add "horizontal" or "vertical" as last parameter.
### Define the RNN vertically
```
neuralNetwork.define(10, 2, ["h","e","l","l","o","w","o","r","l","d","!"], "vertical");
````
### Here's the result:
![rnn](http://sebferrer.fr/byonndimgs/rnn2.png)
