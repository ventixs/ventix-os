// @ventix/kernel-bootstrap — public surface.

export { provideKernel } from './lib/provide-kernel';
export { KernelBootstrap } from './lib/kernel-bootstrap.service';
export { TenantContext, UserContext } from './lib/tenant-context.service';
export { RegistryClient } from './lib/registry-client.service';
export {
  StubTenantSource,
  resolveTenantIdFromUrl,
  type TenantSource,
  type TenantActivation,
} from './lib/tenant-source';
