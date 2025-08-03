import { ExpoConfig, ConfigContext } from 'expo/config';

function getAppNameSuffix(): string {
  switch (process.env.APP_VARIANT) {
    case 'development':
      return ' (Dev)';
    case 'preview':
      return ' (Preview)';
    default:
      return '';
  }
}

function getAppIdentifierSuffix(): string {
  switch (process.env.APP_VARIANT) {
    case 'development':
      return '.dev';
    case 'preview':
      return '.preview';
    default:
      return '';
  }
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'iMigration' + getAppNameSuffix(),
  slug: config.slug!,
  ios: {
    ...config.ios,
    bundleIdentifier: 'com.kiltok.imigration' + getAppIdentifierSuffix(),
  },
  android: {
    ...config.android,
    package: 'com.kiltok.imigration' + getAppIdentifierSuffix(),
  },
});
