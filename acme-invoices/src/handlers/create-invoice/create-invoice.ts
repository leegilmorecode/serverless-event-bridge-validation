import { EventBridgeEvent, Handler } from 'aws-lambda';

import { OrderCreatedEvent } from '@types';
import { schema } from '@schemas/orders/order-created/orders.acme@OrderCreated-v2';
import { v4 as uuid } from 'uuid';
import { validate } from '@packages/validation';

export const handler: Handler<EventBridgeEvent<any, any>> = async (
  event: EventBridgeEvent<any, any>
): Promise<void> => {
  try {
    const correlationId = uuid();
    const method = 'create-invoice.handler';
    const prefix = `${correlationId} - ${method}`;

    console.log(`${prefix} - started`);

    const {
      'detail-type': detailType,
      id,
      detail,
    }: { 'detail-type': string; id: string; detail: OrderCreatedEvent } = event;

    // validate the event against the event schema
    validate(
      detail,
      schema,
      'OrderCreated',
      'OrderCreated#/components/schemas/OrderCreated'
    );

    console.log(
      `${prefix} - result: detail: ${JSON.stringify(
        detail
      )}, detailType: ${detailType}, id: ${id}`
    );

    // we won't actually create an invoice for this example repo
    console.log(`${prefix} - created invoice: ${detail}`);
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};
