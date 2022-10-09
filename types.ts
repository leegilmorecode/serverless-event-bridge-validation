type Metadata = {
  schemaVersion: string;
  idempotencyKey: string;
  correlationId: string;
  causationId?: string;
};

type Address = {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  addressLine4?: string;
  addressPostCode: string;
};

type OrderLine = {
  id: string;
  quantity: number;
  productId: string;
};

export type OrderCreated = {
  orderId: string;
  orderStatus: string;
  address: Address;
  orderLines: OrderLine[];
};

export type OrderCreatedEvent = {
  metadata: Metadata;
  data: OrderCreated;
};
