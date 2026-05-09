/**
 * Generic component the kernel attaches to plugin routes that declare a
 * `panel` instead of a `loadComponent`. Reads the panel content from the
 * route data the DynamicRouterService set during registration.
 *
 * This is the Phase 0.5 "no Module Federation needed" UI surface. Real
 * Angular components ship via MF in Phase 1 (ADR-0004); plugins can mix
 * panels and components freely.
 */
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { PluginPanel } from '@ventix/plugin-api';

@Component({
  selector: 'vtx-plugin-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (panel(); as p) {
      <section class="vtx-panel">
        <h1 class="vtx-panel-title">{{ p.title }}</h1>
        @if (p.body) { <p class="vtx-panel-body">{{ p.body }}</p> }
        <div class="vtx-panel-meta">
          @if (pluginId()) {
            <span>plugin: <code>{{ pluginId() }}</code></span>
          }
        </div>
        @if (p.footnote) { <p class="vtx-panel-footnote">{{ p.footnote }}</p> }
      </section>
    } @else {
      <section class="vtx-panel"><h1>Panel</h1><p>No panel data on this route.</p></section>
    }
  `,
  styles: [
    `
      .vtx-panel { max-width: 720px; padding: 1.5rem; color: var(--vtx-color-fg, #e6e8eb); }
      .vtx-panel-title { font-size: 1.5rem; margin: 0 0 1rem; }
      .vtx-panel-body { line-height: 1.5; color: var(--vtx-color-fg, #e6e8eb); }
      .vtx-panel-meta { margin-top: 1.5rem; color: var(--vtx-color-muted, #8a8f98); font-size: 0.875rem; }
      .vtx-panel-meta code { background: #1c1f24; padding: 2px 6px; border-radius: 3px; }
      .vtx-panel-footnote { margin-top: 1rem; color: var(--vtx-color-muted, #8a8f98); font-size: 0.75rem; }
    `,
  ],
})
export class PluginPanelComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly panel = computed<PluginPanel | null>(() => {
    const data = this.route.snapshot.data as { panel?: PluginPanel };
    return data.panel ?? null;
  });

  protected readonly pluginId = computed<string | null>(() => {
    const data = this.route.snapshot.data as { pluginId?: string };
    return data.pluginId ?? null;
  });
}
