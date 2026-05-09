/**
 * Manifest Schema v1 — implements RFC-0001.
 *
 * This is THE contract between kernel, CLI, marketplace, IDE, and SDK.
 * Strict by default: unknown fields are rejected (catches typos).
 * Future fields are added by future RFCs that explicitly extend this schema.
 *
 * @see docs/rfc/RFC-0001-manifest-schema-v1.md
 */
import { z } from 'zod';

/**
 * Reverse-DNS plugin ID. Globally unique. Cannot change after first publish.
 * @example 'com.acme.crm-plus'
 */
export const PluginIdSchema = z
  .string()
  .regex(
    /^[a-z][a-z0-9-]*(\.[a-z][a-z0-9-]*)+$/,
    'plugin id must be reverse-DNS lowercase (e.g. com.acme.crm-plus)',
  );

/**
 * Strict semver. Pre-release suffixes allowed.
 * @example '1.4.2', '1.0.0-beta.1'
 */
export const SemverSchema = z
  .string()
  .regex(
    /^\d+\.\d+\.\d+(-[A-Za-z0-9.-]+)?$/,
    'must be strict semver MAJOR.MINOR.PATCH[-prerelease]',
  );

const NavigationItemSchema = z.lazy(() =>
  z
    .object({
      id: z.string().min(1),
      label: z.string().min(1),
      icon: z.string().optional(),
      route: z.string().startsWith('/'),
      order: z.number().int().optional(),
      children: z.array(NavigationItemSchema).optional(),
    })
    .strict(),
) as z.ZodType<NavigationItem>;

export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  route: string;
  order?: number;
  children?: NavigationItem[];
}

const PluginRouteSchema = z
  .object({
    path: z.string().min(1),
    component: z.string().min(1),
  })
  .strict();

export type PluginRoute = z.infer<typeof PluginRouteSchema>;

export const ManifestV1Schema = z
  .object({
    $schema: z.string().url(),

    id: PluginIdSchema,
    name: z.string().min(1).max(80),
    version: SemverSchema,

    vendor: z
      .object({
        name: z.string().min(1),
        url: z.string().url().optional(),
      })
      .strict(),

    license: z.string().min(1),

    engine: z
      .object({
        ventix: z.string().min(1),
      })
      .strict(),

    frontend: z
      .object({
        // Either an absolute URL (https://cdn.acme.dev/.../remoteEntry.js)
        // or a same-origin path (/plugins/com.acme.foo/index.js).
        remoteEntry: z.string().refine(isUrlOrAbsolutePath, {
          message: 'must be an absolute URL or a same-origin path starting with "/"',
        }),
        exposedModule: z.string().min(1),
        integrity: z.string().optional(),
      })
      .strict(),

    navigation: z.array(NavigationItemSchema).optional(),
    routes: z.array(PluginRouteSchema).optional(),
  })
  .strict();

export type ManifestV1 = z.infer<typeof ManifestV1Schema>;

function isUrlOrAbsolutePath(value: string): boolean {
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}
