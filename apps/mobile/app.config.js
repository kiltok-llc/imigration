const APP_NAME_SUFFIX = {
  development: ' (Dev)',
  staging: ' (Staging)',
  production: '',
}[process.env.APP_VARIANT];

const APP_IDENTIFIER_SUFFIX = {
  development: '.dev',
  staging: '.staging',
  production: '',
}[process.env.APP_VARIANT];

export default ({ config }) => ({
  ...config,
  name: config.name + APP_NAME_SUFFIX,
  ios: {
    ...config.ios,
    bundleIdentifier: config.ios.bundleIdentifier + APP_IDENTIFIER_SUFFIX,
  },
  android: {
    ...config.android,
    package: config.android.package + APP_IDENTIFIER_SUFFIX,
  },
});
