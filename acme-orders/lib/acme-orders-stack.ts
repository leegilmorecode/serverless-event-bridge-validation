import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

import { Construct } from 'constructs';

export class AcmeOrdersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const ordersEventBus = events.EventBus.fromEventBusName(
      this,
      'acme-orders-event-bus',
      'acme-orders-event-bus'
    );

    const createOrdersHandler: nodeLambda.NodejsFunction =
      new nodeLambda.NodejsFunction(this, 'create-order-handler', {
        functionName: 'acme-create-order-handler',
        runtime: lambda.Runtime.NODEJS_14_X,
        entry: path.join(
          __dirname,
          '/../src/handlers/create-order/create-order.ts'
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

    ordersEventBus.grantPutEventsTo(createOrdersHandler);

    const ordersApi: apigw.RestApi = new apigw.RestApi(this, 'orders-api', {
      description: 'orders api gateway',
      deploy: true,
      deployOptions: {
        stageName: 'prod',
        dataTraceEnabled: true,
        loggingLevel: apigw.MethodLoggingLevel.INFO,
        tracingEnabled: true,
        metricsEnabled: true,
      },
    });

    const orders: apigw.Resource = ordersApi.root.addResource('orders');

    orders.addMethod(
      'POST',
      new apigw.LambdaIntegration(createOrdersHandler, {
        proxy: true,
        allowTestInvoke: true,
      })
    );
  }
}
