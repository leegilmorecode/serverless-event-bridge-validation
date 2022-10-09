#!/usr/bin/env node

import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import { AcmeInfraStack } from '../lib/acme-infra-stack';

const app = new cdk.App();
new AcmeInfraStack(app, 'AcmeInfraStack', {});
