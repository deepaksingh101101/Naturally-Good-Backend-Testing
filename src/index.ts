import { Application } from "./app";
import { connectToMongodb } from "./database";

async function main() {
  await connectToMongodb();
  const app = new Application();
  app.start();
}

main();
