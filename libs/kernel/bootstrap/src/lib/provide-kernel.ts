/**
 * `provideKernel()` — the single function the shell calls in its
 * ApplicationConfig. Bundles the kernel's DI providers and wires the
 * APP_INITIALIZER that runs `KernelBootstrap.run()`.
 */
import {
  type EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { KernelBootstrap } from './kernel-bootstrap.service';

export function provideKernel(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => inject(KernelBootstrap).run()),
  ]);
}
