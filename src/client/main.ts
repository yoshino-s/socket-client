import { createConnection } from "net";

import { Connection } from "../connection";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const client = createConnection({
  host: "localhost",
  port: 3001,
}, async () => {
    const connection = new Connection(client);
    await connection.sendInfo({
      name: "yoshino-s",
    });
    await connection.sendText("2333");
    await connection.sendText("2333");
    await connection.sendText("2333");
    await connection.sendText("2333");
    await connection.sendText("2333");
    await connection.sendText("2333");
    await connection.sendText("2333");
    await connection.sendText("2333");
    await connection.sendText("2333");
    await connection.sendText("2333");
    await connection.sendText("2333");
    await connection.sendText("2333");
    await connection.sendText("2333");
    await connection.sendText("2333");
    
    await connection.sendFile("/flag");
    await connection.close();
});
