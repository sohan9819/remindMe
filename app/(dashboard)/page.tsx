import { wait } from '@/lib/wait';
import { currentUser } from '@clerk/nextjs/server';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import prisma from '@/lib/prisma';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frown } from 'lucide-react';
import CreateCollectionBtn from '@/components/custom/CreateCollectionBtn';
import CollectionCard from '@/components/custom/CollectionCard';

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMsgFallback />}>
        <WelcomMsg />
      </Suspense>
      <Suspense fallback={<div>Loading Collections</div>}>
        <CollectionList />
      </Suspense>
    </>
  );
}

async function WelcomMsg() {
  const user = await currentUser();

  await wait(3000);

  if (!user) {
    return <div>error</div>;
  }

  return (
    <div className='flex w-full mb-12'>
      <h1 className='text-4xl font-bold'>
        Welcome, <br /> {user.firstName} {user.lastName}
      </h1>
    </div>
  );
}

function WelcomeMsgFallback() {
  return (
    <div className='flex w-full mb-12'>
      <h1 className='text-4xl font-bold'>
        <Skeleton className='w-[150px] h-[34px] mb-[2px]' />
        <Skeleton className='w-[180px] h-[34px]' />
      </h1>
    </div>
  );
}

async function CollectionList() {
  const user = await currentUser();
  const collections = await prisma.collection.findMany({
    include: {
      tasks: true,
    },
    where: {
      userId: user?.id,
    },
  });

  if (collections.length === 0) {
    return (
      <div className='flex flex-col gap-5'>
        <Alert>
          <Frown size={24} className='grow w-32' />
          <AlertTitle>There are no collections yet!</AlertTitle>
          <AlertDescription>
            Create a collection to get started
          </AlertDescription>
        </Alert>
        <CreateCollectionBtn />
      </div>
    );
  }

  return (
    <>
      <CreateCollectionBtn />
      <div className='flex flex-col gap-4 mt-6'>
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </>
  );
}
