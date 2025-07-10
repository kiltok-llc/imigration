import { Slot, Slottable } from '@radix-ui/react-slot';
import { ChangeEventHandler, ComponentProps, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FileUpload({
  asChild = false,
  children,
  onChange,
  ...props
}: Omit<ComponentProps<typeof Button>, 'onChange'> & {
  asChild?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}) {
  const Comp = asChild ? Slot : Button;
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Comp
      onClick={() => {
        fileInputRef.current?.click();
      }}
      {...props}
    >
      <Slottable>{children}</Slottable>
      <input
        accept='application/pdf'
        className='hidden'
        onChange={onChange}
        ref={fileInputRef}
        type='file'
      />
    </Comp>
  );
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      data-slot='input'
      {...props}
    />
  );
}
