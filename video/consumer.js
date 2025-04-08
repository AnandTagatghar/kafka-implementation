const { kafka } = require("./kafka");
const fs = require("fs");
const group = process.argv[2];

async function init(videoTopic) {
  let consumer = kafka.consumer({ groupId: group });
  await consumer.connect();
  await consumer.subscribe({ topic: videoTopic, fromBeginning: true });

  const videoWriteStream = fs.createWriteStream("received_video.mp4");

  await consumer.run({
    eachMessage: async ({ topic, message, partition }) => {
      console.log(`Received a chunk of size: ${message.value.length} bytes`);
      videoWriteStream.write(message.value);
    },
  });
}

init(`kafka-test-video`);
