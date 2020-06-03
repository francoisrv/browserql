import Client from '../Client';
import { ConnectOptions } from '../types';
export default function describeClient(label: string, connectOptions: ConnectOptions, ...its: [string, (client: Client) => void | Promise<void>][]): void;
//# sourceMappingURL=describeClient.d.ts.map