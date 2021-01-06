import { resolve } from "path";

import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { MulterModule } from "@nestjs/platform-express";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SocketService } from "./socket.service";
import { WsGateway } from "./ws.gateway";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: resolve("static"),
    }),
    MulterModule.register({
      dest: resolve("./upload"),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, WsGateway, SocketService],
})
export class AppModule {}
