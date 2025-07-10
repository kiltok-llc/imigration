import { memo } from 'react';
import { ErrorBoundary, withErrorBoundary } from 'react-error-boundary';
import { Temporal } from 'temporal-polyfill';

import Rehydrate from '@/components/rehydrate';
import {
  CopyTooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { dayjs } from '@/lib/dayjs';
import { StyledProps } from '@/lib/utils';

const LocalizedDurationInner = memo(function LocalizedDurationInner({
  value,
  verbose,
}: {
  value?: string;
  verbose: boolean;
}) {
  if (!value) {
    return '-';
  }
  if (verbose) {
    return Temporal.Duration.from(value).toLocaleString();
  }
  return dayjs.duration(value).humanize();
});

export function Duration({
  value,
  verbose = false,
}: {
  value?: string;
  verbose?: boolean;
}) {
  return (
    <CopyTooltip copyValue={value}>
      <TooltipTrigger>
        <LocalizedDuration value={value} verbose={verbose} />
      </TooltipTrigger>

      <TooltipContent>
        <LocalizedDuration value={value} verbose />
      </TooltipContent>
    </CopyTooltip>
  );
}

function LocalizedDuration({
  value,
  verbose,
}: {
  value?: string;
  verbose: boolean;
}) {
  return (
    <ErrorBoundary fallback={value ?? '-'} onError={console.warn}>
      <Rehydrate>
        <LocalizedDurationInner value={value} verbose={verbose} />
      </Rehydrate>
    </ErrorBoundary>
  );
}

const LocalizedDatetimeInner = memo(function LocalizedDatetimeInner({
  local = false,
  value,
  ...format
}: Intl.DateTimeFormatOptions & {
  local?: boolean;
  value: string | undefined;
}) {
  if (!value) {
    return '-';
  }

  const instant = Temporal.Instant.from(value);
  if (local) {
    return instant.toLocaleString(undefined, format);
  }

  // TODO what timezone should we show things in?
  return instant.toZonedDateTimeISO('UTC').toLocaleString(undefined, format);
});

/**
 * Localized date with tooltip, rehydration, error handling, and copy to clipboard.
 *
 * @param value ISO 8601 string
 * @param local show time in local timezone
 * @param tz show timezone, defaults to true
 */
export function Date({
  className,
  local,
  tz = true,
  value,
}: StyledProps<{
  local?: boolean;
  tz?: boolean;
  value?: string;
}>) {
  return (
    <CopyTooltip copyValue={value}>
      <TooltipTrigger className={className}>
        <LocalizedDatetime
          format={{
            day: 'numeric',
            month: 'numeric',
            timeZoneName: tz ? 'shortGeneric' : undefined,
            year: 'numeric',
          }}
          local={local}
          value={value}
        />
      </TooltipTrigger>

      <TooltipContent>
        <LocalizedDatetime
          format={{
            dateStyle: 'full',
            timeStyle: 'full',
          }}
          local={local}
          value={value}
        />
      </TooltipContent>
    </CopyTooltip>
  );
}

/**
 * Localized datetime with tooltip, rehydration, error handling, and copy to clipboard.
 *
 * @param value ISO 8601 string
 * @param tz show timezone, defaults to true
 */
export function Datetime({
  tz = true,
  value,
}: Intl.DateTimeFormatOptions & {
  tz?: boolean;
  value?: string;
}) {
  return (
    <CopyTooltip copyValue={value}>
      <TooltipTrigger>
        <LocalizedDatetime
          format={{
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            month: 'short',
            second: 'numeric',
            timeZoneName: tz ? 'shortGeneric' : undefined,
            year: 'numeric',
          }}
          value={value}
        />
      </TooltipTrigger>

      <TooltipContent>
        <LocalizedDatetime
          format={{
            dateStyle: 'full',
            timeStyle: 'full',
          }}
          value={value}
        />
      </TooltipContent>
    </CopyTooltip>
  );
}

/**
 * Wrapper around <time> with a error boundary and rehydration.
 *
 * @param value ISO 8601 string
 * @param options Date formatting options
 */
export function LocalizedDatetime({
  format,
  local,
  value,
}: {
  format: Intl.DateTimeFormatOptions;
  local?: boolean;
  value?: string;
}) {
  return (
    <time dateTime={value}>
      <ErrorBoundary fallback={value} onError={console.warn}>
        <Rehydrate>
          <LocalizedDatetimeInner local={local} value={value} {...format} />
        </Rehydrate>
      </ErrorBoundary>
    </time>
  );
}

/**
 * @param start start of range, ISO 8601 string
 * @param end end of range, ISO 8601 string
 */
export const DateRange = withErrorBoundary(
  function DateRange({
    className,
    end,
    format = {
      dateStyle: 'medium',
    },
    start,
  }: StyledProps<{
    end?: string;
    format?: Intl.DateTimeFormatOptions;
    start?: string;
  }>) {
    if (start === undefined || end === undefined) {
      return '-';
    }

    return (
      <span className={className}>
        <CopyTooltip copyValue={start}>
          <TooltipTrigger className='inline'>
            <LocalizedDatetime format={format} value={start} />
          </TooltipTrigger>

          <TooltipContent>
            <LocalizedDatetime
              format={{
                dateStyle: 'full',
                timeStyle: 'full',
              }}
              value={start}
            />
          </TooltipContent>
        </CopyTooltip>

        {' - '}

        <CopyTooltip copyValue={end}>
          <TooltipTrigger className='inline'>
            <LocalizedDatetime format={format} value={end} />
          </TooltipTrigger>

          <TooltipContent>
            <LocalizedDatetime
              format={{
                dateStyle: 'full',
                timeStyle: 'full',
              }}
              value={end}
            />
          </TooltipContent>
        </CopyTooltip>
      </span>
    );
  },
  {
    fallback: '-',
    onError: console.warn,
  }
);
