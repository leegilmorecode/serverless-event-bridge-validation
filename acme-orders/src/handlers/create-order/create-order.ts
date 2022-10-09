import * as AWS from 'aws-sdk';

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { OrderCreated, OrderCreatedEvent } from '@types';
import { v4 as uuid, v5 as uuidV5 } from 'uuid';

import { PutEventsRequestEntry } from 'aws-sdk/clients/eventbridge';
import { namespaces } from '@namespaces';
import { schema } from '@schemas/orders/order-created/orders.acme@OrderCreated-v2';
import { validate } from '@packages/validation';

const eventBridge = new AWS.EventBridge();

export const handler: APIGatewayProxyHandler = async ({
  body,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const correlationId = uuid();
    const method = 'create-order.handler';
    const prefix = `${correlationId} - ${method}`;

    const eventBusName = process.env.ORDERS_BUS_NAME;

    if (!body) throw new Error('no order body');

    // we get the order details from the event
    const order: OrderCreated = JSON.parse(body);

    // we generate an idempotency key
    const idempotencyKey: string = uuidV5(
      JSON.stringify(order),
      namespaces.orders
    );

    // create the detail of the event
    const orderEvent: OrderCreatedEvent = {
      metadata: {
        schemaVersion: '2.0.0',
        idempotencyKey,
        correlationId,
        causationId: correlationId,
      },
      data: {
        ...order,
      },
    };

    console.log(`${prefix} - order: ${JSON.stringify(orderEvent)}`);

    // validate the event against the event schema
    validate(
      orderEvent,
      schema,
      'OrderCreated',
      'OrderCreated#/components/schemas/OrderCreated'
    );

    const createEvent: PutEventsRequestEntry = {
      Detail: JSON.stringify({ ...orderEvent }),
      DetailType: 'OrderCreated',
      EventBusName: eventBusName,
      Source: 'orders.acme',
    };

    const subscriptionEvent: AWS.EventBridge.PutEventsRequest = {
      Entries: [createEvent],
    };

    await eventBridge.putEvents(subscriptionEvent).promise();

    return {
      statusCode: 201,
      body: JSON.stringify(order),
    };
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify(error.message),
    };
  }
};
