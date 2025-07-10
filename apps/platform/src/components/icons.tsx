import { FC, SVGProps } from 'react';

import { cn } from '@/lib/utils';

type TrafficIconProps = SVGProps<SVGSVGElement> & {
  hover?: string;
  normal?: string;
  press?: string;
  unfocus?: string;
};

interface TrafficIcons {
  hover: FC<TrafficIconProps>;
  normal: FC<TrafficIconProps>;
  press: FC<TrafficIconProps>;
  unfocus: FC<TrafficIconProps>;
}

export function CloseTrafficIconHover(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      enableBackground='new 0 0 85.4 85.4'
      viewBox='0 0 85.4 85.4'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipRule='evenodd' fillRule='evenodd'>
        <path
          d='m42.7 85.4c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7-42.7 19.1-42.7 42.7 19.1 42.7 42.7 42.7z'
          fill='#e24b41'
        />

        <path
          d='m42.7 81.8c21.6 0 39.1-17.5 39.1-39.1s-17.5-39.1-39.1-39.1-39.1 17.5-39.1 39.1 17.5 39.1 39.1 39.1z'
          fill='#ed6a5f'
        />

        <g fill='#460804'>
          <path d='m22.5 57.8 35.3-35.3c1.4-1.4 3.6-1.4 5 0l.1.1c1.4 1.4 1.4 3.6 0 5l-35.3 35.3c-1.4 1.4-3.6 1.4-5 0l-.1-.1c-1.3-1.4-1.3-3.6 0-5z' />

          <path d='m27.6 22.5 35.3 35.3c1.4 1.4 1.4 3.6 0 5l-.1.1c-1.4 1.4-3.6 1.4-5 0l-35.3-35.3c-1.4-1.4-1.4-3.6 0-5l.1-.1c1.4-1.3 3.6-1.3 5 0z' />
        </g>
      </g>
    </svg>
  );
}

export function CloseTrafficIconNormal(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      enableBackground='new 0 0 85.4 85.4'
      viewBox='0 0 85.4 85.4'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipRule='evenodd' fillRule='evenodd'>
        <path
          d='m42.7 85.4c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7-42.7 19.1-42.7 42.7 19.1 42.7 42.7 42.7z'
          fill='#e24b41'
        />

        <path
          d='m42.7 81.8c21.6 0 39.1-17.5 39.1-39.1s-17.5-39.1-39.1-39.1-39.1 17.5-39.1 39.1 17.5 39.1 39.1 39.1z'
          fill='#ed6a5f'
        />
      </g>
    </svg>
  );
}

export function CloseTrafficIconPress(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      enableBackground='new 0 0 85.4 85.4'
      viewBox='0 0 85.4 85.4'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipRule='evenodd' fillRule='evenodd'>
        <path
          d='m42.7 85.4c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7-42.7 19.1-42.7 42.7 19.1 42.7 42.7 42.7z'
          fill='#a14239'
        />

        <path
          d='m42.7 81.7c21.6 0 39.1-17.5 39.1-39.1s-17.5-39.1-39.1-39.1-39.1 17.5-39.1 39.1 17.5 39.1 39.1 39.1z'
          fill='#b15048'
        />

        <g fill='#170101'>
          <path d='m22.5 57.8 35.3-35.3c1.4-1.4 3.6-1.4 5 0l.1.1c1.4 1.4 1.4 3.6 0 5l-35.3 35.3c-1.4 1.4-3.6 1.4-5 0l-.1-.1c-1.4-1.4-1.4-3.7 0-5z' />

          <path d='m27.5 22.5 35.3 35.3c1.4 1.4 1.4 3.6 0 5l-.1.1c-1.4 1.4-3.6 1.4-5 0l-35.3-35.3c-1.4-1.4-1.4-3.6 0-5l.1-.1c1.4-1.4 3.7-1.4 5 0z' />
        </g>
      </g>
    </svg>
  );
}

export function DiscordIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill='currentColor' viewBox='0 0 127.14 96.36' {...props}>
      <path
        clipRule='evenodd'
        d='M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z'
        fillRule='evenodd'
      />
    </svg>
  );
}

export function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
        fill='currentColor'
      />
    </svg>
  );
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z'
        fill='currentColor'
      />
    </svg>
  );
}

export function MaximizeTrafficIconHover(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      enableBackground='new 0 0 85.4 85.4'
      viewBox='0 0 85.4 85.4'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipRule='evenodd' fillRule='evenodd'>
        <path
          d='m42.7 85.4c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7-42.7 19.1-42.7 42.7 19.1 42.7 42.7 42.7z'
          fill='#2dac2f'
        />

        <path
          d='m42.7 81.8c21.6 0 39.1-17.5 39.1-39.1s-17.5-39.1-39.1-39.1-39.1 17.5-39.1 39.1c0 21.5 17.5 39.1 39.1 39.1z'
          fill='#61c555'
        />

        <path
          d='m31.2 20.8h26.7c3.6 0 6.5 2.9 6.5 6.5v26.7zm23.2 43.7h-26.8c-3.6 0-6.5-2.9-6.5-6.5v-26.8z'
          fill='#2a6218'
        />
      </g>
    </svg>
  );
}

export function MaximizeTrafficIconNormal(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      enableBackground='new 0 0 85.4 85.4'
      viewBox='0 0 85.4 85.4'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipRule='evenodd' fillRule='evenodd'>
        <path
          d='m42.7 85.4c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7-42.7 19.1-42.7 42.7 19.1 42.7 42.7 42.7z'
          fill='#2dac2f'
        />

        <path
          d='m42.7 81.8c21.6 0 39.1-17.5 39.1-39.1s-17.5-39.1-39.1-39.1-39.1 17.5-39.1 39.1 17.5 39.1 39.1 39.1z'
          fill='#61c555'
        />
      </g>
    </svg>
  );
}

export function MaximizeTrafficIconPress(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      enableBackground='new 0 0 85.4 85.4'
      viewBox='0 0 85.4 85.4'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipRule='evenodd' fillRule='evenodd'>
        <path
          d='m42.7 85.4c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7-42.7 19.1-42.7 42.7 19.1 42.7 42.7 42.7z'
          fill='#428234'
        />

        <path
          d='m42.7 81.8c21.6 0 39.1-17.5 39.1-39.1s-17.5-39.1-39.1-39.1-39.1 17.5-39.1 39.1c0 21.5 17.5 39.1 39.1 39.1z'
          fill='#4a9741'
        />

        <path
          d='m31.2 20.8h26.7c3.6 0 6.5 2.9 6.5 6.5v26.7zm23.2 43.7h-26.8c-3.6 0-6.5-2.9-6.5-6.5v-26.8z'
          fill='#113107'
        />
      </g>
    </svg>
  );
}

export function MinimizeTrafficIconHover(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      enableBackground='new 0 0 85.4 85.4'
      viewBox='0 0 85.4 85.4'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipRule='evenodd' fillRule='evenodd'>
        <path
          d='m42.7 85.4c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7-42.7 19.1-42.7 42.7 19.1 42.7 42.7 42.7z'
          fill='#e1a73e'
        />

        <path
          d='m42.7 81.8c21.6 0 39.1-17.5 39.1-39.1s-17.5-39.1-39.1-39.1-39.1 17.5-39.1 39.1 17.5 39.1 39.1 39.1z'
          fill='#f6be50'
        />

        <path
          d='m17.8 39.1h49.9c1.9 0 3.5 1.6 3.5 3.5v.1c0 1.9-1.6 3.5-3.5 3.5h-49.9c-1.9 0-3.5-1.6-3.5-3.5v-.1c0-1.9 1.5-3.5 3.5-3.5z'
          fill='#90591d'
        />
      </g>
    </svg>
  );
}

export function MinimizeTrafficIconNormal(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      enableBackground='new 0 0 85.4 85.4'
      viewBox='0 0 85.4 85.4'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipRule='evenodd' fillRule='evenodd'>
        <path
          d='m42.7 85.4c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7-42.7 19.1-42.7 42.7 19.1 42.7 42.7 42.7z'
          fill='#e1a73e'
        />

        <path
          d='m42.7 81.8c21.6 0 39.1-17.5 39.1-39.1s-17.5-39.1-39.1-39.1-39.1 17.5-39.1 39.1 17.5 39.1 39.1 39.1z'
          fill='#f6be50'
        />
      </g>
    </svg>
  );
}

export function MinimizeTrafficIconPress(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      enableBackground='new 0 0 85.4 85.4'
      viewBox='0 0 85.4 85.4'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipRule='evenodd' fillRule='evenodd'>
        <path
          d='m42.7 85.4c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7-42.7 19.1-42.7 42.7c0 23.5 19 42.7 42.7 42.7z'
          fill='#a67f36'
        />

        <path
          d='m42.7 81.7c21.6 0 39.1-17.5 39.1-39.1s-17.5-39.1-39.1-39.1-39.1 17.5-39.1 39.1c-.1 21.6 17.4 39.1 39.1 39.1z'
          fill='#b8923b'
        />

        <path
          d='m17.7 39.1h49.9c1.9 0 3.5 1.6 3.5 3.5v.1c0 1.9-1.6 3.5-3.5 3.5h-49.9c-1.9 0-3.5-1.6-3.5-3.5v-.1c0-1.9 1.6-3.5 3.5-3.5z'
          fill='#532a0a'
        />
      </g>
    </svg>
  );
}

export function UnfocusedTrafficIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      enableBackground='new 0 0 85.4 85.4'
      viewBox='0 0 85.4 85.4'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <g clipRule='evenodd' fillRule='evenodd'>
        <path
          d='m42.7 85.4c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7-42.7 19.1-42.7 42.7 19.1 42.7 42.7 42.7z'
          fill='#d1d0d2'
        />

        <path
          d='m42.7 81.7c21.6 0 39.1-17.5 39.1-39.1s-17.5-39.1-39.1-39.1-39.1 17.5-39.1 39.1 17.5 39.1 39.1 39.1z'
          fill='#c7c7c7'
        />
      </g>
    </svg>
  );
}

const buildTrafficIcon = (icons: TrafficIcons) =>
  function TrafficIcon({
    className,
    hover,
    normal,
    press,
    unfocus,
    ...props
  }: TrafficIconProps) {
    return (
      <div className='group/icon grid *:[grid-area:1/1]'>
        <icons.unfocus className={cn(unfocus, className)} {...props} />

        <icons.normal className={cn('hidden', normal, className)} {...props} />

        <icons.hover className={cn('hidden', hover, className)} {...props} />

        <icons.press className={cn('hidden', press, className)} {...props} />
      </div>
    );
  };

export const CloseTrafficIcon = buildTrafficIcon({
  hover: CloseTrafficIconHover,
  normal: CloseTrafficIconNormal,
  press: CloseTrafficIconPress,
  unfocus: UnfocusedTrafficIcon,
});

export const MinimizeTrafficIcon = buildTrafficIcon({
  hover: MinimizeTrafficIconHover,
  normal: MinimizeTrafficIconNormal,
  press: MinimizeTrafficIconPress,
  unfocus: UnfocusedTrafficIcon,
});

export const MaximizeTrafficIcon = buildTrafficIcon({
  hover: MaximizeTrafficIconHover,
  normal: MaximizeTrafficIconNormal,
  press: MaximizeTrafficIconPress,
  unfocus: UnfocusedTrafficIcon,
});
