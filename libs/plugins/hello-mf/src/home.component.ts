import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'mf-hello-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="mf-home">
      <h1>👋 Hello from a real plugin component</h1>
      <p>
        This component is shipped by <code>com.demo.hello-mf</code> as a
        Module Federation remote. It uses the shell's Angular instance via
        the MF singleton registry — no Angular bundled in the plugin.
      </p>
      <p>
        Click count from the plugin's own signal:
        <button (click)="inc()">{{ count() }}</button>
      </p>
    </section>
  `,
  styles: [
    `
      .mf-home { max-width: 720px; padding: 1.5rem; color: #e6e8eb; }
      .mf-home h1 { font-size: 1.5rem; }
      .mf-home code { background: #1c1f24; padding: 2px 6px; border-radius: 3px; }
      .mf-home button {
        background: #4f8cff;
        color: white;
        border: none;
        padding: 4px 12px;
        border-radius: 4px;
        cursor: pointer;
      }
    `,
  ],
})
export default class HomeComponent {
  protected readonly count = signal(0);
  inc(): void {
    this.count.update((n) => n + 1);
  }
}
