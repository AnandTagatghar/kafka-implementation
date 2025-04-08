const { Kafka } = require("kafkajs");

exports.kafka = new Kafka({
  clientId: "video-send",
  brokers: ["localhost:9092"],
  maxMessageBytes: 10000000
});