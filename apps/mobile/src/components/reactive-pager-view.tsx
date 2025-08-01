import { ComponentProps, useEffect, useRef } from 'react';
import PagerView from 'react-native-pager-view';

export function ReactivePagerView({ page, ...props }: ComponentProps<typeof PagerView> & {
  page: number;
}) {
  const pagerViewRef = useRef<PagerView>(null);

  useEffect(() => {
    pagerViewRef.current?.setPage(page);
  }, [page]);

  return (
    <PagerView initialPage={page} ref={pagerViewRef} scrollEnabled={false} {...props} />
  )
}