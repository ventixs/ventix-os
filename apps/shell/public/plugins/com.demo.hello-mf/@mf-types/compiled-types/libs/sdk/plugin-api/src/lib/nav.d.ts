/**
 * Navigation contract. Most plugins declare nav items in the manifest;
 * this API is for runtime-conditional items.
 */
import type { Disposable } from './disposable';
export interface NavItemSpec {
    id: string;
    label: string;
    icon?: string;
    /** Fully-qualified plugin route, e.g. '/com.acme.crm-plus/leads'. */
    route: string;
    order?: number;
    permission?: string;
    children?: NavItemSpec[];
}
export interface NavApi {
    /** Add nav items at runtime. Returned Disposable removes them on dispose. */
    register(items: NavItemSpec[]): Disposable;
    /**
     * Navigate to any href. Use a fully-qualified path with the destination
     * plugin's id (e.g. '/com.other.plugin/home') for cross-plugin links.
     */
    open(href: string, opts?: {
        target?: 'self' | 'blank';
    }): void;
}
