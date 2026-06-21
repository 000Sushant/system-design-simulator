import { AwsServiceType } from '../models/architecture.model';

/**
 * Service types that may live inside a VPC network boundary. A `vpc` source
 * may only connect to these targets. Kept as a named constant so the rule is
 * self-documenting and not buried as a literal array in business logic.
 */
export const VPC_ATTACHABLE_TYPES: readonly AwsServiceType[] = [
  'ec2', 'ecs', 'lambda', 'rds', 'elastiCache', 'autoScalingGroup', 'elb',
  'natGateway', 'eks', 'aurora', 'msk', 'efs', 'secretsManager', 'mq',
  'redshift', 'openSearch', 'fsx', 'ecr', 'privateLink',
];
