'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

const buttonVariants = cva(
  "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    defaultVariants: {
      rounded: 'md',
      size: 'default',
      variant: 'default',
    },
    variants: {
      rounded: {
        full: 'rounded-full',
        lg: 'rounded-lg',
        md: 'rounded-md',
        none: 'rounded-none',
      },
      size: {
        default: 'min-h-9 px-4 py-2 has-[>svg]:px-3',
        icon: 'size-9',
        'icon-sm': 'size-8',
        lg: 'min-h-10 px-6 has-[>svg]:px-4',
        sm: 'min-h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        xl: 'min-h-12 px-8 has-[>svg]:px-6',
      },
      variant: {
        dashed:
          'border-muted-foreground/60 hover:border-muted-foreground border-2 border-dashed',
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
        destructive:
          'bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white shadow-xs',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        outline:
          'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs',
      },
    },
  }
);

function Button({
  asChild = false,
  children,
  className,
  disabled = false,
  loading = false,
  preventShrink = false,
  rounded,
  size,
  style,
  variant,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
    preventShrink?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  const ref = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState<number | undefined>();

  // capture button size after first render
  useLayoutEffect(() => {
    if (ref.current && preventShrink) {
      setWidth(ref.current.offsetWidth);
    }
  }, [preventShrink]);

  return (
    <Comp
      className={buttonVariants({
        className,
        rounded,
        size,
        variant,
      })}
      data-slot='button'
      disabled={disabled || loading}
      ref={ref}
      style={{ ...style, minWidth: width }}
      {...props}
    >
      {loading ? <Loader2 className='animate-spin' /> : null}

      <Slottable>{children}</Slottable>
    </Comp>
  );
}

export { Button, buttonVariants };
