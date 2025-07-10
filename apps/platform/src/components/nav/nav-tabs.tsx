import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/animated-tabs';
import { NavItemOut } from '@/hooks/use-active-nav';

export default function NavTabs({
  navigation,
}: {
  navigation: NavItemOut<{ name: string }>[];
}) {
  const segment = useSelectedLayoutSegment();
  return (
    <Tabs value={segment ?? ''}>
      <TabsList>
        {navigation.map((item) => (
          <TabsTrigger asChild key={item.segment} value={item.segment ?? ''}>
            <Link href={item.href}>{item.name}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
