/**

 alarm.js - Copyright 2023 Harshad Joshi and Bufferstack.IO Analytics Technology LLP, Pune

 Licensed under the GNU General Public License, Version 3.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 https://www.gnu.org/licenses/gpl-3.0.html

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 **/

module.exports = function(RED) {
    function MonitorNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;

        var messageWindow = []; // Array to hold recent messages

        node.on('input', function(msg) {
            // Check if msg.payload is an object and if msg.payload.outOfControl is a boolean
            if(msg.payload && typeof msg.payload.outOfControl === "boolean") {
                // Push the outOfControl flag to the message window
                messageWindow.push(msg.payload.outOfControl);

                // Check the window size
                var messageWindowSize = Number.isInteger(config.messageWindowSize) && config.messageWindowSize > 0 ? config.messageWindowSize : 5;

                // When the window is filled, analyze its state
                if(messageWindow.length === messageWindowSize) {
                    // If all the messages in the message window are true (outOfControl), send an alarm
                    if(messageWindow.every(val => val === true)) {
                        msg.payload = { 
                            alarm: 'Alarm condition present, check system' 
                        };
                        node.send(msg);
                        node.status({fill:"red",shape:"ring",text:"Alarm: Out of control"});
                    } else if(messageWindow.some(val => val === true)) {
                        // If there is any true message in the message window, it's a spike
                        msg.payload = { 
                            spike: 'It was a spike! Nothing to worry.' 
                        };
                        node.send(msg);
                        node.status({fill:"yellow",shape:"ring",text:"Spike detected"});
                    } else {
                        // If none of the messages are true (outOfControl), it's a normal state
                        node.status({fill:"green",shape:"dot",text:"Normal state"});
                    }

                    // Reset the message window after it reaches the maximum size
                    messageWindow = [];
                    //node.status({fill:"orange",shape:"ring",text:"Refilling Buffer..."});
                }
            } else {
                node.status({fill:"grey",shape:"ring",text:"Waiting for msg.payload.outOfControl..."});
            }
        });

        // Handle errors
        node.on('error', function(error) {
            node.status({fill:"red", shape:"ring", text: "Error: " + error.message});
        });
    }
    RED.nodes.registerType("alarm", MonitorNode);
}

