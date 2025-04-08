const { kafka } = require("./kafka");
const fs = require("fs");

async function init(videoFilePath, videoTopic) {
  let producer = kafka.producer();
  await producer.connect();

  let videoFile = fs.createReadStream(videoFilePath, {
    highWaterMark: 1024 * 1024,
  });

  videoFile.on("data", async (chunk) => {
    await producer.send({
      topic: videoTopic,
      messages: [
        {
          value: chunk,
        },
      ],
    });
  });

  videoFile.on("end", async () => {
    console.log(`video file send successfully`);
    await producer.disconnect();
  });
  
  videoFile.on("error", async (error) => {
    console.log(`Error on sending video file: ${error.message}`);
    await producer.disconnect();
  });
}

init(`../static/video.mp4`, `kafka-test-video`);
