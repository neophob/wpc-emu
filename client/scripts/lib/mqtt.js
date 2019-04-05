'use strict';

//npx mqtt publish -h  -i "d:sz0xhu:WPC-Client:001" -t "iot-2/evt/foo/fmt/json" -m '{ "value": 2 }'
//-u "use-token-auth" -P "(QPJ2DKZlqMRv60+XV"

import * as MQTT from 'mqtt';

export { connectToBroker };

function connectToBroker() {
  return new MQTTClient({
  });
}

class MQTTClient {

  constructor(mqttSettings) {
    this.mqttSettings = mqttSettings;
    this.client = null;
  }

  connect() {
    const { brokerUrl, clientId, username, password } = this.mqttSettings;
    this.client = MQTT.connect(brokerUrl, {
      clientId,
      username,
      password,
    });

    this.client.on('connect', () => {
      console.log('CONNECTED!');
    });

    this.client.on('message', (topic, message) => {
      console.log('INCOMING', message.toString());
      client.end();
    });

    this.client.on('reconnect', () => { console.log('RECONNECT'); });
    this.client.on('close', () => { console.log('close'); });
    this.client.on('packetsend', () => { console.log('packetsend'); });

    this.client.on('error', () => {
      console.log('CONNECTED!');
    });
  }

  publish(eventName, jsonMessage) {
    //mqtt.Client#publish(topic, message, [options], [callback])
    if (!this.client) {
      console.log('NOT CONNECTED!');
      return;
    }
    const { topicPrefix, topicPostfix } = this.mqttSettings;
    const topic = `${topicPrefix}${eventName}${topicPostfix}`;
    this.client.publish(topic, JSON.stringify(jsonMessage));
  }

}
