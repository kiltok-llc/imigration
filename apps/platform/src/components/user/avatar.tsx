import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton, skeletonVariants } from '@/components/ui/skeleton';
import { useCurrentUser } from '@/queries/user';

export function CurrentNamedAvatar() {
  const { avatarUrl, name } = useCurrentUser();
  return <NamedAvatar avatarUrl={avatarUrl} name={name} />;
}

export function NamedAvatar({
  avatarUrl,
  name,
}: {
  avatarUrl?: null | string;
  name: string;
}) {
  return (
    <>
      <Avatar>
        <AvatarImage alt={name} src={avatarUrl ?? ''} />

        <AvatarFallback>{name.split(' ').map((n) => n[0])}</AvatarFallback>
      </Avatar>

      <span className='truncate'>{name}</span>
    </>
  );
}

export function NamedAvatarSkeleton() {
  return (
    <>
      <Avatar>
        <AvatarImage alt='' src='' />

        <AvatarFallback className={skeletonVariants()} />
      </Avatar>

      <Skeleton size='label' />
    </>
  );
}
