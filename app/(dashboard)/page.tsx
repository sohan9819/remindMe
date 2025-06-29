import { wait } from '@/lib/wait';
import { currentUser } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default async function Home() {
  return (
    <Suspense fallback={<WelcomeMsgFallback />}>
      <WelcomMsg />
    </Suspense>
  );
}

async function WelcomMsg() {
  const user = await currentUser();

  await wait(3000);

  if (!user) {
    return <div>error</div>;
  }

  return (
    <div className='flex w-full'>
      <h1 className='text-4xl font-bold'>
        Welcome, <br /> {user.firstName} {user.lastName}
      </h1>
    </div>
  );
}

function WelcomeMsgFallback() {
  return (
    <div className='flex w-full'>
      <h1 className='text-4xl font-bold'>
        <Skeleton className='w-[150px] h-[34px] mb-[2px]' />
        <Skeleton className='w-[180px] h-[34px]' />
      </h1>
    </div>
  );
}
