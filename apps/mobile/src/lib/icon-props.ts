import { FunctionComponent } from 'react';

export type IconComponent = FunctionComponent<IconProps>;

export type IconProps = {
  color?: string;
  size?: number;
};
