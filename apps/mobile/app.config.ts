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
  name: 'iMigration' + getAppNameSuffix(),
  scheme: 'imigration' + getAppSchemeSuffix(),
  slug: 'imigration',
  ios: {
    bundleIdentifier: 'com.kiltok.imigration' + getAppIdentifierSuffix(),
  },
  android: {
    package: 'com.kiltok.imigration' + getAppIdentifierSuffix(),
  },
});
