import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { KernelBootstrap, TenantContext } from '@ventix/kernel-bootstrap';
import { NavigationService } from '@ventix/kernel-nav';
import { PluginRegistry } from '@ventix/kernel-registry';

@Component({
  selector: 'vtx-shell',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="vtx-shell-header">
      <a class="vtx-brand" routerLink="/">VENTIX</a>
      <span class="vtx-tenant">{{ tenant.current()?.name ?? '…' }}</span>
      <nav class="vtx-nav">
        @for (item of nav.tree(); track item.id) {
          <a class="vtx-nav-item" [routerLink]="item.route">{{ item.label }}</a>
        } @empty {
          <span class="vtx-nav-empty">no plugins</span>
        }
      </nav>
      <span class="vtx-status">
        ready={{ ready() }} · plugins={{ pluginCount() }}
      </span>
    </header>

    <main class="vtx-shell-main">
      <router-outlet />
    </main>
  `,
})
export class ShellComponent {
  protected readonly nav = inject(NavigationService);
  protected readonly tenant = inject(TenantContext);
  private readonly registry = inject(PluginRegistry);
  protected readonly ready = inject(KernelBootstrap).ready;
  protected readonly pluginCount = computed(() => this.registry.all().length);
}
