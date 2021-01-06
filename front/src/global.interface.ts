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
}
