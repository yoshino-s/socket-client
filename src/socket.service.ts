import { createConnection, NetConnectOpts, Socket } from "net";
import { promisify } from "util";

import { Injectable, Logger } from "@nestjs/common";
import { Subject } from "rxjs";

import { Connection } from "./connection";

@Injectable()
export class SocketService {
  connection?: Connection;
  updateSubject = new Subject<Connection>();
  error = new Subject<string>();
  private readonly logger = new Logger(SocketService.name);
  constructor() {
    //
  }
  async connect(host: string, port: number, name?: string) {
    if (this.connection && !this.connection.connectionInfo.close) {
      await this.connection.close();
    }
    const socket = await new Promise<Socket>((res, rej) => {
      const socket = createConnection({
        host, port,
      }, () => {
          res(socket);
      });
      socket.on("error", (err) => {
        this.error.next(err.toString());
        rej(err);
      });
    });
    const conn = new Connection(socket);
    this.updateSubject.next(conn);
    this.connection = conn;
    if (name) {
      conn.sendInfo({
        name,
      });
    }
    conn.on("close", () => {
      this.updateSubject.next(conn);
    });
    conn.on("info", () => {
      this.updateSubject.next(conn);
    });
    return conn.connectionInfo;
  }

  async onApplicationShutdown() {
    await this.connection?.close();
  }
}
