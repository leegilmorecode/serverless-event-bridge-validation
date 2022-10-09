export const schema = {
  openapi: '3.0.0',
  info: { version: '1.0.0', title: 'OrderCreated' },
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
          orderId: { type: 'string' },
          orderLines: {
            type: 'array',
            items: { $ref: '#/components/schemas/DataItem' },
          },
          orderStatus: { type: 'string' },
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
          causationId: { type: 'string' },
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
        properties: {
          addressLine1: { type: 'string' },
          addressLine2: { type: 'string' },
          addressLine3: { type: 'string' },
          addressLine4: { type: 'string' },
          addressPostCode: { type: 'string' },
        },
      },
      DataItem: {
        type: 'object',
        required: ['quantity', 'productId', 'id'],
        properties: {
          id: { type: 'string' },
          productId: { type: 'string' },
          quantity: { type: 'number' },
        },
      },
    },
  },
};
