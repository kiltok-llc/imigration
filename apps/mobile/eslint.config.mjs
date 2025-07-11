import baseConfig from '@repo/eslint-config/base';
import expoConfig from '@repo/eslint-config/expo';

// TODO lint useQuery (and friends) -> useQuery

export default [...expoConfig, ...baseConfig];
