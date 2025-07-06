import { ExpoConfig, ConfigContext } from 'expo/config';

function getAppNameSuffix(): string {
  switch (process.env.APP_VARIANT) {
    case 'development':
      return ' (Dev)';
    case 'staging':
      return ' (Staging)';
    case 'production':
      return '';
    default:
      throw new Error('Invalid APP_VARIANT environment variable');
  }
}

function getAppIdentifierSuffix(): string {
  switch (process.env.APP_VARIANT) {
    case 'development':
      return '.dev';
    case 'staging':
      return '.staging';
    case 'production':
      return '';
    default:
      throw new Error('Invalid APP_VARIANT environment variable');
  }
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name + getAppNameSuffix(),
  slug: config.slug!,
  ios: {
    ...config.ios,
    bundleIdentifier: config.ios!.bundleIdentifier + getAppIdentifierSuffix(),
  },
  android: {
    ...config.android,
    package: config.android!.package + getAppIdentifierSuffix(),
  },
});
