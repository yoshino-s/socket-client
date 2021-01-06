export interface BaseMessage {
  type: string;
  self?: boolean;
}

export interface TextMessage extends BaseMessage {
  type: "text",
  text: string;
}

export interface FileMessage extends BaseMessage {
  type: "file",
  file: {
    tmpFd: number,
    tmpFile: string,
    fileName: string,
    size: number,
    md5?: string,
  };
}

export type Message = TextMessage | FileMessage;

export type MessageWithTimestamp = Message & { timestamp: number };
