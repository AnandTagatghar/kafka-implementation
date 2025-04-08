const { kafka } = require("./kafka");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function init() {
  let producer = kafka.producer();

  await producer.connect();

  rl.setPrompt("> ");
  rl.prompt();

  rl.on("line", async (line) => {
    const [riderName, location] = line.split(" ");
    console.log(riderName, location);
    await producer.send({
      topic: "rider-update",
      messages: [
        {
          partition: location.toLowerCase().trim() === "north" ? 0 : 1,
          key: "location-update",
          value: JSON.stringify({ riderName, location }),
        },
      ],
    });
  }).on("close", async () => {
    await producer.disconnect();
  });
}

init();
