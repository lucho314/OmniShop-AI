export interface OptionHandler {
  handle(user: string, msg: any): Promise<void>;
}
