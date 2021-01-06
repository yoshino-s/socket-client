import { EventEmitter } from "events";
import { Socket } from "net";
import { promisify } from "util";
import { parse } from "path";
import { existsSync, readFileSync, statSync } from "fs";
import { createHash } from "crypto";

import StrictEventEmitter from "strict-event-emitter-types";
import { merge } from "lodash";

import { RecvFile, uid } from "./global.interface";
import { Message, MessageWithTimestamp, TextMessage } from "./message.interface";

export interface ConfigurableConnectionInfo {
  name: string;
}

export interface ConnectionInfo extends ConfigurableConnectionInfo {
  remoteAddress: string;
  remotePort: number;
  selfPort: number;
  family: string;
  id: string;
  close: boolean;
  error?: string;
}

export class Connection extends (EventEmitter as {
  new(): StrictEventEmitter<EventEmitter, {
    recv(data: any): void;
    close(): void;
    text(s: string): void;
    file(file: RecvFile): void;
    info(info: { clientName?: string }): void;
    message(message: Message): void;
    error(error: Error): void;
    _info(info: { clientName?: string }): void;
    _text(s: string): void;
    _file(f: { name: string, size: number, content: string, md5?: string }): void;
  }>
}) {
  connectionInfo: ConnectionInfo;
  private buffer = "";
  history: MessageWithTimestamp[] = [];
  constructor(readonly socket: Socket) {
    super();
    this.connectionInfo = {
      remoteAddress: socket.remoteAddress,
      remotePort: socket.remotePort,
      selfPort: socket.localPort,
      family: socket.remoteFamily,
      id: uid(),
      name: socket.remoteAddress,
      close: false,
    };
    socket.on("error", (err) => {
      this.connectionInfo.error = err.message;
      this.emit("error", err);
    });
    socket.on("data", (data) => {
      let newData = data.toString();
      let index = -1;
      while ((index = newData.indexOf("\x00")) !== -1) {
        this.buffer += newData.slice(0, index);
        try {
          const recvData = JSON.parse(this.buffer);
          this.emit("recv", recvData);
          this.buffer = "";
        } catch(e) {
          //
        }
        newData = newData.slice(index + 1);
      }
      this.buffer += newData;
    });
    socket.on("end", () => {
      this.connectionInfo.close = true;
      this.emit("close");
    });
    this.on("recv", (data) => {
      if (typeof data?.event === "string" && data?.data) {
        this.emit("_" + data.event as any, data.data);
      }
    });
    this.on("_info", info => {
      this.connectionInfo = merge(this.connectionInfo, info);
      this.emit("info", info);
    });
    this.on("_text", text => {
      const message: TextMessage = {
        type: "text",
        text,
      };
      this.addHistory(message);
      this.emit("text", text);
    });
    this.on("_file", f => {
      const file = new RecvFile(f.name, f.size, f.md5);
      file.write(f.content);
      file.close();
      this.addHistory({
        type: "file",
        file,
      });
      this.emit("file", file);
    });
  }
  async addHistory(message: Message) {
    const msg = { ...message, timestamp: Date.now()};
    this.emit("message", msg);
    this.history.push(msg);
  }
  async sendEvent(event: string, data: any) {
    await promisify(this.socket.write.bind(this.socket))(JSON.stringify({
      event,
      data,
    }) + "\x00");
  }

  async sendText(s: string) {
    this.addHistory({
      type: "text",
      self: true,
      text: s,
    });
    await this.sendEvent("text", s);
  }

  async sendInfo(info: ConfigurableConnectionInfo) {
    await this.sendEvent("info", info);
  }

  async sendFile(path: string, name?: string) {
    const base = name ?? parse(path).base;
    if (!existsSync(path)) {
      throw Error("file not found");
    }
    const { size } = statSync(path);
    const content = readFileSync(path).toString();
    const f = {
      name: base,
      size,
      content,
      md5: createHash("md5").update(content).digest("hex"),
    };
    this.addHistory({
      type: "file",
      self: true,
      file: {
        tmpFd: -1,
        tmpFile: path,
        fileName: base,
        size,
        md5: f.md5,
      },
    });
    this.sendEvent("file", f);
  }

  async close() {
    await promisify(this.socket.end.bind(this.socket))();
    this.emit("close");
  }
}
