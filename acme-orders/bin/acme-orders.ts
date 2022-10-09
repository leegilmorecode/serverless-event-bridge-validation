#!/usr/bin/env node

import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import { AcmeOrdersStack } from '../lib/acme-orders-stack';

const app = new cdk.App();
new AcmeOrdersStack(app, 'AcmeOrdersStack', {});
