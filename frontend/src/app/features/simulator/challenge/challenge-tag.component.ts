import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface CategoryStyle {
  color: string;
  bg: string;
  icon: string;
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  // Categories
  'web services': { color: '#0ea5e9', bg: 'rgba(14, 165, 233, 0.12)', icon: 'fa-globe' },
  social: { color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)', icon: 'fa-users' },
  platform: { color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)', icon: 'fa-layer-group' },
  media: { color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)', icon: 'fa-photo-film' },
  gaming: { color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.12)', icon: 'fa-gamepad' },
  search: { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)', icon: 'fa-magnifying-glass' },
  // Company tags (brand color + logo where Font Awesome has one)
  instagram: { color: '#e1306c', bg: 'rgba(225, 48, 108, 0.12)', icon: 'fab fa-instagram' },
  whatsapp: { color: '#128c7e', bg: 'rgba(18, 140, 126, 0.12)', icon: 'fab fa-whatsapp' },
  twitter: { color: '#1da1f2', bg: 'rgba(29, 161, 242, 0.12)', icon: 'fab fa-twitter' },
  youtube: { color: '#ff0000', bg: 'rgba(255, 0, 0, 0.1)', icon: 'fab fa-youtube' },
  amazon: { color: '#ff9900', bg: 'rgba(255, 153, 0, 0.12)', icon: 'fab fa-amazon' },
  google: { color: '#4285f4', bg: 'rgba(66, 133, 244, 0.12)', icon: 'fab fa-google' },
  duolingo: { color: '#58cc02', bg: 'rgba(88, 204, 2, 0.12)', icon: 'fab fa-duolingo' },
  stripe: { color: '#635bff', bg: 'rgba(99, 91, 255, 0.12)', icon: 'fab fa-stripe-s' },
  'bit.ly': { color: '#ee6123', bg: 'rgba(238, 97, 35, 0.12)', icon: 'fa-link' },
  imgur: { color: '#1bb76e', bg: 'rgba(27, 183, 110, 0.12)', icon: 'fa-images' },
  pastebin: { color: '#2563eb', bg: 'rgba(37, 99, 235, 0.12)', icon: 'fa-paste' },
  airflow: { color: '#017cee', bg: 'rgba(1, 124, 238, 0.12)', icon: 'fa-wind' },
};

/** Resolves a category name to a consistent color + icon used across the panel. */
export function categoryStyle(text: string): CategoryStyle {
  return (
    CATEGORY_STYLES[(text || '').toLowerCase()] ?? {
      color: '#64748b',
      bg: 'rgba(100, 116, 139, 0.12)',
      icon: 'fa-tag',
    }
  );
}

/** Small colored category chip. */
@Component({
  selector: 'app-challenge-tag',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="cat-chip"
      [style.color]="style.color"
      [style.background]="style.bg"
    >
      <i [ngClass]="getIconClass()"></i>{{ text }}
    </span>
  `,
  styles: [
    `
      .cat-chip {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 10px;
        font-weight: 500;
        line-height: 1;
        padding: 3px 7px 3px 6px;
        border-radius: 999px;
        white-space: nowrap;
        letter-spacing: 0.01em;
      }
      .cat-chip i {
        font-size: 8.5px;
        opacity: 0.9;
      }
    `,
  ],
})
export class ChallengeTagComponent {
  @Input() text = '';

  get style(): CategoryStyle {
    return categoryStyle(this.text);
  }

  getIconClass(): string {
    const icon = this.style.icon;
    if (icon.startsWith('fab ') || icon.startsWith('fas ') || icon.startsWith('far ')) {
      return icon;
    }
    return `fas ${icon}`;
  }
}
