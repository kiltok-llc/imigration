import { ExpoConfig, ConfigContext } from 'expo/config';

const APP_VARIANT = process.env.APP_VARIANT!;

function getAppNameSuffix(): string {
  switch (APP_VARIANT) {
    case 'development':
      return ' (Dev)';
    case 'preview':
      return ' (Preview)';
    default:
      return '';
  }
}

function getAppIdentifierSuffix(): string {
  switch (APP_VARIANT) {
    case 'development':
      return '.dev';
    case 'preview':
      return '.preview';
    default:
      return '';
  }
}

function getAppSchemeSuffix(): string {
  switch (APP_VARIANT) {
    case 'development':
      return '-dev';
    case 'preview':
      return '-preview';
    default:
      return '';
  }
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name + getAppNameSuffix(),
  scheme: config.scheme + getAppSchemeSuffix(),
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
