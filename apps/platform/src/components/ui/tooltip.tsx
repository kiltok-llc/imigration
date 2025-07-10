'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import {
  ComponentProps,
  createContext,
  RefObject,
  useCallback,
  useContext,
  useRef,
} from 'react';

import { useCopyValue } from '@/hooks/use-copy';
import { cn } from '@/lib/utils';

const TooltipCopyContext = createContext<{
  contentRef?: RefObject<HTMLDivElement | null>;
  copyFn?: () => null | string | undefined;
}>({});

export function CopyTooltip({
  copyValue,
  ...props
}: ComponentProps<typeof Tooltip> & {
  copyValue?: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const copyFn = useCallback(
    () => copyValue ?? contentRef.current?.textContent,
    [copyValue]
  );
  return (
    <TooltipCopyContext.Provider value={{ contentRef, copyFn }}>
      <Tooltip {...props} />
    </TooltipCopyContext.Provider>
  );
}

export function Tooltip({
  ...props
}: ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot='tooltip' {...props} />
    </TooltipProvider>
  );
}

export function TooltipContent({
  children,
  className,
  sideOffset = 0,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  const { contentRef } = useContext(TooltipCopyContext);
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(
          'bg-secondary text-secondary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
          className
        )}
        data-slot='tooltip-content'
        sideOffset={sideOffset}
        {...props}
      >
        <div ref={contentRef}>{children}</div>

        <TooltipPrimitive.Arrow className='bg-secondary fill-secondary z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]' />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export function TooltipProvider({
  delayDuration = 0,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot='tooltip-provider'
      delayDuration={delayDuration}
      {...props}
    />
  );
}

export function TooltipTrigger({
  onClick,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Trigger>) {
  const { copyFn } = useContext(TooltipCopyContext);
  const [_, copy] = useCopyValue(copyFn);
  return (
    <TooltipPrimitive.Trigger
      data-slot='tooltip-trigger'
      onClick={onClick ?? copy}
      {...props}
    />
  );
}
