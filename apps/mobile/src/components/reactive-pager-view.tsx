import { ComponentProps, useEffect, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';

export function ReactivePagerView({
  page,
  ...props
}: ComponentProps<typeof PagerView> & {
  page: number;
}) {
  const pagerViewRef = useRef<PagerView>(null);

  useEffect(() => {
    pagerViewRef.current?.setPage(page);
  }, [page]);

  // workaround for https://github.com/callstack/react-native-pager-view/issues/971
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <PagerView
      initialPage={page}
      onLayout={() => setScrollEnabled(false)}
      ref={pagerViewRef}
      scrollEnabled={scrollEnabled}
      {...props}
    />
  );
}
