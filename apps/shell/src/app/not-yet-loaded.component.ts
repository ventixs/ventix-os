import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PluginRegistry } from '@ventix/kernel-registry';

/**
 * Phase 0 fallback for plugin-owned routes. Real route components require
 * Module Federation to share the host's Angular instance (ADR-0004), which
 * lands in Phase 1. Until then, this component shows the user what would
 * have rendered, and confirms the plugin is correctly attributed.
 */
@Component({
  selector: 'vtx-not-yet-loaded',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="vtx-nyl">
      <h1>Plugin route not yet loaded</h1>
      @if (pluginRecord()) {
        <p>
          This URL belongs to plugin
          <code>{{ pluginRecord()?.id }}</code> v{{ pluginRecord()?.manifest?.version }}.
        </p>
        <p class="vtx-nyl-state">
          state: <strong>{{ pluginRecord()?.state }}</strong>
        </p>
      } @else {
        <p>The URL <code>{{ url() }}</code> does not match any registered plugin.</p>
      }
      <p class="vtx-nyl-note">
        Route component loading requires Module Federation (ADR-0004) and
        lands in Phase 1. The plugin runtime loop, navigation, registry, and
        lifecycle FSM are already in place — see <code>docs/PHASE-0-PLAN.md</code>.
      </p>
    </section>
  `,
  styles: [
    `
      .vtx-nyl {
        max-width: 720px;
        padding: 1.5rem;
        color: var(--vtx-color-fg);
      }
      .vtx-nyl h1 { font-size: 1.25rem; margin-bottom: 1rem; }
      .vtx-nyl code {
        background: #1c1f24;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 0.875rem;
      }
      .vtx-nyl-state strong { color: var(--vtx-color-accent); }
      .vtx-nyl-note {
        margin-top: 1.5rem;
        color: var(--vtx-color-muted);
        font-size: 0.875rem;
        line-height: 1.5;
      }
    `,
  ],
})
export class NotYetLoadedComponent {
  private readonly registry = inject(PluginRegistry);
  private readonly route = inject(ActivatedRoute);

  protected readonly url = computed(() => {
    const segments = this.route.snapshot.url.map((s) => s.path).join('/');
    return segments;
  });

  protected readonly pluginRecord = computed(() => {
    const first = this.route.snapshot.url[0]?.path ?? '';
    return this.registry.byId(first);
  });
}
