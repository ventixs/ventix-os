import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, type Route } from '@angular/router';
import { provideKernel } from '@ventix/kernel-bootstrap';
import { NotYetLoadedComponent } from './not-yet-loaded.component';

/**
 * Phase 0 default routes. The kernel registers plugin routes dynamically
 * via DynamicRouterService; this wildcard catches paths owned by plugins
 * that haven't loaded their components yet (Phase 1 / Module Federation).
 */
const routes: Route[] = [
  { path: '**', component: NotYetLoadedComponent },
];

export const shellConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideKernel(),
  ],
};
