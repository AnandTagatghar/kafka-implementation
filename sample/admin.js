const { kafka } = require("./kafka");

async function init() {
  const admin = kafka.admin();

  await admin.connect();
  console.log("admin connected");

  const existingTopics = await admin.listTopics();
  if (existingTopics.includes("rider-update")) {
    console.log("Topic 'rider-update' already exists.");
    return;
  }

  await admin.createTopics({
    topics: [
      {
        topic: "rider-update",
        numPartitions: 2,
        replicationFactor: 1,
      },
    ],
  });

  await admin.disconnect();
}

init();
