const { kafka } = require("./kafka");
const group = process.argv[2];

async function init() {
  let consumer = kafka.consumer({ groupId: group });

  await consumer.connect();
  await consumer.subscribe({ topics: ["rider-update"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message, partition, heartbeat, pause }) => {
      console.log("trigger");
      console.log(
        `${group}: [${topic}]: ${partition}`,
        message.value.toString()
      );
    },
  });
}

init();
