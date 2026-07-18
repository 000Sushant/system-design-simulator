import { AwsServiceType } from '../models/architecture.model';

export const VPC_ATTACHABLE_TYPES: readonly AwsServiceType[] = [
  'ec2', 'ecs', 'lambda', 'rds', 'elastiCache', 'autoScalingGroup', 'elb',
  'natGateway', 'eks', 'aurora', 'msk', 'efs', 'secretsManager', 'mq',
  'redshift', 'openSearch', 'fsx', 'ecr', 'privateLink',
];
