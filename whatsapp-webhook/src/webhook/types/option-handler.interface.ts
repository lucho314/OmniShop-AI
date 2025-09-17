export type msg = {
  text?: {
    body?: string;
  };
} | null;

export interface OptionHandler {
  handle(user: string, msg: msg): Promise<void>;
}
