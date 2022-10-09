import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import * as targets from 'aws-cdk-lib/aws-events-targets';

import { Construct } from 'constructs';

export class AcmeInvoicesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ordersEventBus = events.EventBus.fromEventBusName(
      this,
      'acme-orders-event-bus',
      'acme-orders-event-bus'
    );

    const createInvoiceHandler: nodeLambda.NodejsFunction =
      new nodeLambda.NodejsFunction(this, 'create-invoice-handler', {
        functionName: 'acme-create-invoice-handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        entry: path.join(
          __dirname,
          '/../src/handlers/create-invoice/create-invoice.ts'
        ),
        memorySize: 1024,
        handler: 'handler',
        bundling: {
          minify: true,
          externalModules: ['aws-sdk'],
        },
        environment: {
          ORDERS_BUS_NAME: ordersEventBus.eventBusName,
        },
      });

    new events.Rule(this, 'OrderCreatedRule', {
      eventBus: ordersEventBus,
      ruleName: 'OrderCreatedRule',
      description: 'order created rule',
      eventPattern: {
        source: ['orders.acme'],
        detailType: ['OrderCreated'],
      },
      targets: [new targets.LambdaFunction(createInvoiceHandler, {})],
    });
  }
}
