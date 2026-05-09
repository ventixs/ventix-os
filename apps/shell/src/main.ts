import { bootstrapApplication } from '@angular/platform-browser';
import { ShellComponent } from './app/shell.component';
import { shellConfig } from './app/shell.config';

bootstrapApplication(ShellComponent, shellConfig).catch((err) =>
  console.error('[VENTIX] shell failed to bootstrap', err),
);
