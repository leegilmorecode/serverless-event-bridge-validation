import { orderRegexes } from '@regexes/orders/order';

export const schema = {
  openapi: '3.0.0',
  info: { version: '2.0.0', title: 'OrderCreated' },
  paths: {},
  components: {
    schemas: {
      AWSEvent: {
        type: 'object',
        required: [
          'detail-type',
          'resources',
          'detail',
          'id',
          'source',
          'time',
          'region',
          'version',
          'account',
        ],
        'x-amazon-events-detail-type': 'OrderCreated',
        'x-amazon-events-source': 'orders.acme',
        properties: {
          detail: { $ref: '#/components/schemas/OrderCreated' },
          account: { type: 'string' },
          'detail-type': { type: 'string' },
          id: { type: 'string' },
          region: { type: 'string' },
          resources: { type: 'array', items: { type: 'object' } },
          source: { type: 'string' },
          time: { type: 'string', format: 'date-time' },
          version: { type: 'string' },
        },
      },
      OrderCreated: {
        type: 'object',
        required: ['metadata', 'data'],
        properties: {
          data: { $ref: '#/components/schemas/Data' },
          metadata: { $ref: '#/components/schemas/Metadata' },
        },
      },
      Data: {
        type: 'object',
        required: ['address', 'orderLines', 'orderId', 'orderStatus'],
        properties: {
          address: { $ref: '#/components/schemas/Address' },
          orderId: { type: 'string', pattern: orderRegexes.orderId },
          orderLines: {
            type: 'array',
            items: { $ref: '#/components/schemas/DataItem' },
          },
          orderStatus: { type: 'string', enum: ['Created', 'Cancelled'] },
        },
      },
      Metadata: {
        type: 'object',
        required: [
          'schemaVersion',
          'idempotencyKey',
          'causationId',
          'correlationId',
        ],
        properties: {
          causationId: { type: 'string', nullable: true },
          correlationId: { type: 'string' },
          idempotencyKey: { type: 'string' },
          schemaVersion: { type: 'string' },
        },
      },
      Address: {
        type: 'object',
        required: [
          'addressLine1',
          'addressPostCode',
          'addressLine2',
          'addressLine3',
          'addressLine4',
        ],
        minProperties: 5,
        properties: {
          addressLine1: { type: 'string', pattern: orderRegexes.addressLine },
          addressLine2: {
            type: 'string',
            pattern: orderRegexes.addressLine,
            nullable: true,
          },
          addressLine3: {
            type: 'string',
            pattern: orderRegexes.addressLine,
            nullable: true,
          },
          addressLine4: { type: 'string', pattern: orderRegexes.addressLine },
          addressPostCode: {
            type: 'string',
            pattern: orderRegexes.addressLine,
          },
        },
      },
      DataItem: {
        type: 'object',
        minProperties: 3,
        nullable: true,
        required: ['quantity', 'productId', 'id'],
        properties: {
          id: { type: 'string', nullable: false },
          productId: {
            type: 'string',
            nullable: false,
            pattern: orderRegexes.productId,
          },
          quantity: { type: 'number', minimum: 1, maximum: 20 },
        },
      },
    },
  },
};
