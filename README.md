# Node-RED Spike Reporter Node
This is a node for Node-RED which monitors a system's state and generates alarms based on consecutive out-of-control status indications. This node accepts input from the `node-red-contrib-simple-spc` node.

## Installation
To install this node, run the following command in your Node-RED user directory - typically `~/.node-red`:
```
npm install node-red-contrib-spike-reporter
```

## Usage
The Alarm node accepts a message object (`msg`) with a payload property (`msg.payload`). The payload should be an object with an `outOfControl` property, which is a boolean.

The node will track the `outOfControl` status in a moving window of messages. When the window fills up, the node will evaluate the window:

- If all of the `outOfControl` values are `true`, the node will generate an alarm message, and update its status to "Alarm: Out of Control".
- If some but not all of the `outOfControl` values are `true`, the node will generate a spike message, and update its status to "Spike detected".
- If none of the `outOfControl` values are `true`, the node will maintain a normal status.

The node's status will also update if the message object does not have the expected `outOfControl` property, or if there's an error in the node.

## Configuration
- **Message Window Size:** The size of the message window can be configured using the `messageWindowSize` property in the node configuration. By default, the size is set to 5.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the [GPL-3.0 License](https://opensource.org/licenses/GPL-3.0).

