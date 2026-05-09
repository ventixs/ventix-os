
    export type RemoteKeys = 'REMOTE_ALIAS_IDENTIFIER/Plugin';
    type PackageType<T> = T extends 'REMOTE_ALIAS_IDENTIFIER/Plugin' ? typeof import('REMOTE_ALIAS_IDENTIFIER/Plugin') :any;