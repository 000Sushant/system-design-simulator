import { SafeHtml } from '@angular/platform-browser';

export interface DocArticle {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  content: string[];
  tips?: string[];
}

export interface ReleaseNote {
  version: string;
  date?: string;
  current?: boolean;
  title: string;
  summary: string;
  items: { icon: string; text: string }[];
}

export interface ServiceDoc {
  whyNeeded: string;
  beginnerExplanation: string;
  whenToUse: string;
  whenNotToUse: string;
  practicalExample: string;
  keyCapabilities: string[];
  useCases: string[];
  illustrationSvg: SafeHtml;
  bottleneck: {
    kind: string;
    failureMode: string;
    capacityDriver: string;
    summary: string;
    saturationCondition?: string;
    atSaturation?: string;
  } | null;
}
