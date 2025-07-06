import 'ts-node/register';
// Can't use short import here due to ts-node limitations
import { env } from './src/env';
import { ExpoConfig, ConfigContext } from 'expo/config';

const APP_NAME_SUFFIX = {
  development: ' (Dev)',
  staging: ' (Staging)',
  production: '',
}[env.APP_VARIANT];

const APP_IDENTIFIER_SUFFIX = {
  development: '.dev',
  staging: '.staging',
  production: '',
}[env.APP_VARIANT];

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name + APP_NAME_SUFFIX,
  slug: config.slug!,
  ios: {
    ...config.ios,
    bundleIdentifier: config.ios!.bundleIdentifier + APP_IDENTIFIER_SUFFIX,
  },
  android: {
    ...config.android,
    package: config.android!.package + APP_IDENTIFIER_SUFFIX,
  },
});
