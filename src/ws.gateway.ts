import { MessageBody, SubscribeMessage, WebSocketGateway, ConnectedSocket } from "@nestjs/websockets";
import WebSocket from "ws";
import { fromEvent } from "rxjs";
import { map } from "rxjs/operators";

import { SocketService } from "./socket.service";
import { Message } from "./message.interface";



@WebSocketGateway()
export class WsGateway {
  constructor(
    private readonly socketService: SocketService,
  ) {
    //
  }

  @SubscribeMessage("events")
  public events() {
    return this.socketService.updateSubject.asObservable().pipe(map(v=>v.connectionInfo));
  }

  @SubscribeMessage("error")
  public error() {
    return this.socketService.error.asObservable().pipe(map(v=>({error: v})));
  }

  @SubscribeMessage("message")
  public message(
    @MessageBody() data: any,
    @ConnectedSocket() socket: WebSocket,
  ) {
    const res = this.socketService.connection;
    if (res) {
      socket.send(JSON.stringify(res.history));
      if (res.connectionInfo.close) {
        socket.terminate();
        return;
      }
      const observable = fromEvent<Message>(res, "message");
      res.on("close", () => {
        socket.terminate();
      });
      return observable;
    } else {
      socket.terminate();
    }
  }
}
