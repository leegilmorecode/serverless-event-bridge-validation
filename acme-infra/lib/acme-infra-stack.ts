import * as events from 'aws-cdk-lib/aws-events';
import * as eventschemas from 'aws-cdk-lib/aws-eventschemas';

import { RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';

import { Construct } from 'constructs';

export class AcmeInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const ordersEventBus: events.EventBus = new events.EventBus(
      this,
      'acme-orders-event-bus',
      {
        eventBusName: 'acme-orders-event-bus',
      }
    );
    ordersEventBus.applyRemovalPolicy(RemovalPolicy.DESTROY);

    new eventschemas.CfnRegistry(this, 'acme-schema-regsitry', {
      registryName: 'acme-shared-schema-registry',
      description: 'acme shared schema registry',
    });
  }
}
