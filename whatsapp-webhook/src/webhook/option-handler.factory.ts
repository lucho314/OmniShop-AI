import { Injectable } from '@nestjs/common';
import { OrderHandler } from './handlers/order.handler';
import { PriceHandler } from './handlers/price.handler';
import { PaymentHandler } from './handlers/payment.handler';
import { OptionHandler } from './types/option-handler.interface';
import { MenuHandler } from './handlers/menu.handler';

@Injectable()
export class OptionHandlerFactory {
  private handlers: Record<string, OptionHandler>;

  constructor(
    private readonly order: OrderHandler,
    private readonly price: PriceHandler,
    private readonly payment: PaymentHandler,
    private readonly menu: MenuHandler,
  ) {
    // inicializamos el mapa de handlers
    this.handlers = {
      BTN_ORDER: this.order,
      BTN_PRICE: this.price,
      BTN_AGENT: this.payment,
      BTN_PAY: this.payment,
      BTN_MENU: this.menu,
    };
  }

  getHandler(code: string): OptionHandler | null {
    return this.handlers[code] ?? null;
  }
}
