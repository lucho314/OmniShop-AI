import { Injectable } from '@nestjs/common';
import { OptionHandler } from '../types/option-handler.interface';

@Injectable()
export class OrderHandler implements OptionHandler {
  handle(user: string, msg: any): Promise<void> {
    console.log(`Estado de pedido solicitado por ${user}`);
    // lógica para responder al cliente
    return Promise.resolve();
  }
}
