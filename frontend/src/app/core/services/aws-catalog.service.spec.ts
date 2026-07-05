import { describe, it, expect, beforeEach } from 'vitest';
import { AwsCatalogService } from './aws-catalog.service';
import { ValidationRuleService } from './validation-rule.service';
import { VPC_ATTACHABLE_TYPES } from '../constants/connection-rules.constants';

const KNOWN_CATEGORIES = new Set([
  'Compute', 'Containers', 'Networking & Content Delivery', 'Storage', 'Database',
  'Analytics', 'Machine Learning', 'Application Integration', 'Developer Tools',
  'Management & Governance', 'Security, Identity, & Compliance', 'Media Services',
  'Internet of Things', 'Users',
]);

describe('AwsCatalogService', () => {
  let catalog: AwsCatalogService;

  beforeEach(() => {
    catalog = new AwsCatalogService();
  });

  describe('catalog integrity', () => {
    it('loads a non-empty catalog where every service has the core fields', () => {
      expect(catalog.services.length).toBeGreaterThan(0);
      for (const service of catalog.services) {
        expect(service.type).toBeTruthy();
        expect(service.name).toBeTruthy();
        expect(service.category).toBeTruthy();
        expect(service.defaults).toBeTruthy();
      }
    });

    it('maps every service to a known category (catches category typos)', () => {
      for (const service of catalog.services) {
        expect(KNOWN_CATEGORIES.has(service.category)).toBe(true);
      }
    });
  });

  describe('getByType', () => {
    it('round-trips every catalog service by its type', () => {
      for (const service of catalog.services) {
        expect(catalog.getByType(service.type)).toBe(service);
      }
    });

    it('throws for an unknown service type', () => {
      expect(() => catalog.getByType('totally-not-a-service' as never)).toThrow(/unknown aws service type/i);
    });
  });

  describe('categoryColor', () => {
    it('returns the mapped color for a known category', () => {
      expect(catalog.categoryColor('Database')).toBe('#6d28d9');
    });

    it('falls back to slate for an unmapped category', () => {
      expect(catalog.categoryColor('Nonexistent Category')).toBe('#94a3b8');
    });
  });

  describe('cross-config integrity', () => {
    it('every connection rule references service types that exist in the catalog', () => {
      const validation = new ValidationRuleService();
      const known = new Set(catalog.services.map((s) => s.type));
      for (const rule of validation.rules) {
        if (rule.source !== '*') {
          expect(known.has(rule.source), `rule ${rule.id} source ${rule.source}`).toBe(true);
        }
        if (rule.target !== '*') {
          expect(known.has(rule.target), `rule ${rule.id} target ${rule.target}`).toBe(true);
        }
      }
    });

    it('every VPC-attachable type exists in the catalog', () => {
      const known = new Set(catalog.services.map((s) => s.type));
      for (const type of VPC_ATTACHABLE_TYPES) {
        expect(known.has(type), `VPC-attachable ${type}`).toBe(true);
      }
    });
  });
});
