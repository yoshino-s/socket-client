import { existsSync } from "fs";

import { Body, Controller, Get, NotFoundException, Post, Query, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";

import { SocketService } from "./socket.service";

@Controller("api")
export class AppController {
  constructor(
    private readonly socketService: SocketService,
  ) {
    //
  }
  @Get("connect")
  connect(@Query("host") host: string, @Query("port") port: string, @Query("name") name?: string) {
    this.socketService.connect(host, parseInt(port), name);
    return;
  }
  @Get("disconnect")
  async disconnect() {
    const res = this.socketService.connection;
    if (res) {
      await res.close();
      return res.connectionInfo;
    } else {
      throw new NotFoundException();
    }
  }
  @Get("client")
  listClient() {
    return this.socketService.connection?.connectionInfo;
  }
  @Post("send")
  async sendText(@Body("text") text: string) {
    const res = this.socketService.connection;
    if (res && !res.connectionInfo.close) {
      await res.sendText(text);
      return res.connectionInfo;
    }
    else {
      throw new NotFoundException();
    }
  }
  @Post("send/file")
  @UseInterceptors(FileInterceptor("file"))
  async sendFile(@UploadedFile() file) {
    const res = this.socketService.connection;
    if (res && !res.connectionInfo.close) {
      await res.sendFile(file.path, file.fileName);
      return res.connectionInfo;
    }
    else {
      throw new NotFoundException();
    }
  }

  @Get("download")
  downloadContent(@Query("path") path: string, @Query("name") name: string, @Res() res: Response) {
    if (!existsSync(path)) {
      throw new NotFoundException();
    }
    res.download(path, name);
  }
}
