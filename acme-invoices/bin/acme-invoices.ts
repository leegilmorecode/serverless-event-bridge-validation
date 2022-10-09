#!/usr/bin/env node

import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import { AcmeInvoicesStack } from '../lib/acme-invoices-stack';

const app = new cdk.App();
new AcmeInvoicesStack(app, 'AcmeInvoicesStack', {});
