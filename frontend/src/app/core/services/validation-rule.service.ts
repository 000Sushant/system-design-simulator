import { Injectable } from '@angular/core';
import { ArchitectureConnection, ArchitectureNode, ConnectionRule, PortType, ServicePort, ValidationResult } from '../models/architecture.model';
import awsServicesConfig from '../config/aws-services.json';
import { VPC_ATTACHABLE_TYPES } from '../constants/connection-rules.constants';

@Injectable({ providedIn: 'root' })
export class ValidationRuleService {
  readonly rules: ConnectionRule[];

  constructor() {
    const rawData: any = awsServicesConfig;
    const servicesData = rawData.services || (rawData.default && rawData.default.services) || [];
    
    const dynamicRules: ConnectionRule[] = [];
    servicesData.forEach((service: any) => {
      if (service.rules) {
        service.rules.forEach((rule: any, index: number) => {
          dynamicRules.push({
            id: `${service.type}-${rule.target}-${index}`,
            source: service.type,
            target: rule.target,
            sourcePortTypes: rule.sourcePorts,
            targetPortTypes: rule.targetPorts,
            connectionType: rule.type,
            description: rule.description
          });
        });
      }
    });
    this.rules = dynamicRules;
  }

  validate(
    source: ArchitectureNode,
    sourcePort: ServicePort,
    target: ArchitectureNode,
    targetPort: ServicePort,
    existingConnections: ArchitectureConnection[]
  ): ValidationResult {
    if (this.rules.length === 0) {
      return { allowed: false, message: 'Architectural rules are still loading. Please wait a moment.' };
    }

    if (source.id === target.id) {
      return { allowed: false, message: 'A service cannot connect to itself.' };
    }

    if (sourcePort.direction !== 'output' || targetPort.direction !== 'input') {
      return { allowed: false, message: 'Connections must start from an output port and end at an input port.' };
    }

    if (source.type === 'vpc' && !VPC_ATTACHABLE_TYPES.includes(target.type)) {
      return { allowed: false, message: 'VPC is a network boundary and can only contain network-aware services.' };
    }

    const duplicate = existingConnections.some((connection) =>
      connection.sourceNodeId === source.id &&
      connection.sourcePortId === sourcePort.id &&
      connection.targetNodeId === target.id &&
      connection.targetPortId === targetPort.id
    );
    if (duplicate) {
      return { allowed: false, message: 'That connection already exists.' };
    }

    const rule = this.rules.find((candidate) => {
      const sourceMatch = candidate.source === source.type || candidate.source === '*';
      const targetMatch = candidate.target === target.type || candidate.target === '*';
      
      if (!sourceMatch || !targetMatch) return false;

      const portMatch = candidate.sourcePortTypes.includes(sourcePort.type) && 
                       candidate.targetPortTypes.includes(targetPort.type);
      
      return portMatch;
    });

    if (!rule) {
      return {
        allowed: false,
        message: `${source.name} (${sourcePort.type}) cannot connect to ${target.name} (${targetPort.type}). Check the architecture rules in aws-services.json.`
      };
    }

    return { allowed: true, message: rule.description, ruleId: rule.id };
  }

  connectionTypeFor(ruleId: string | undefined, fallback: PortType): PortType {
    return this.rules.find((rule) => rule.id === ruleId)?.connectionType ?? fallback;
  }
}
