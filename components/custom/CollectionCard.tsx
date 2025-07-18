'use client';

import { Collection, Task } from '@/lib/generated/prisma';
import React, { useMemo, useState, useTransition } from 'react';
import { Collapsible } from '../ui/collapsible';
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from '@radix-ui/react-collapsible';
import { ChevronsUpDown, Plus, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CollectionColor, CollectionColors } from '@/lib/constants';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteCollection } from '@/actions/collection';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import CreateTaskDialog from './CreateTaskDialog';
import TaskCard from './TaskCard';

interface Props {
  key: number;
  collection: Collection & {
    tasks: Task[];
  };
}

const CollectionCard = ({ key, collection }: Props) => {
  const router = useRouter();
  const tasks = collection.tasks;
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, startTransition] = useTransition();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const removeCollection = async () => {
    try {
      await deleteCollection(collection.id);
      toast.success('Collection deleted successfully!');
      router.refresh();
    } catch (error) {
      toast.error('Something went wrong. Please try again later', {
        action: {
          label: 'Try Again',
          onClick: () => removeCollection(),
        },
      });
      console.log('Error while deleting a collection : ', error);
    }
  };

  const totalTasks = collection.tasks.length;
  const taskDone = useMemo(() => {
    return collection.tasks.filter((task) => task.done).length;
  }, [collection.tasks]);
  const progress = totalTasks === 0 ? 0 : (taskDone / totalTasks) * 100;

  return (
    <>
      <CreateTaskDialog
        open={showCreateModal}
        setOpen={setShowCreateModal}
        collection={collection}
      />
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className={cn(
              'flex w-full justify-between p-6',
              isOpen && 'rounded-b-none',
              CollectionColors[collection.color as CollectionColor],
            )}>
            <span className='text-white font-bold'>{collection.name}</span>
            <ChevronsUpDown className='h-6 w-6' />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent
          className={
            'flex rounded-b-md flex-col dark:bg-neutral-900 shadow-lg'
          }>
          {tasks.length === 0 && (
            <Button
              variant={'ghost'}
              className='flex items-center justify-center gap-1 p-8 py-12 rounded-none'
              onClick={() => setShowCreateModal(true)}>
              <p>There are no tasks yet :</p>
              <span
                className={cn(
                  'text-sm bg-clip-text text-transparent',
                  CollectionColors[collection.color as CollectionColor],
                )}>
                Create one
              </span>
            </Button>
          )}
          {tasks.length > 0 && (
            <>
              <Progress className='rounded-none' value={progress} />
              <div className='p-4 gap-3 flex flex-col'>
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </>
          )}
          <Separator />
          <footer className='h-[40px] px-2 p-[2px] text-xs text-neutral-500 flex justify-between items-center'>
            <p>Created at {collection.createdAt.toLocaleDateString('en-IN')}</p>
            {isLoading && <div>Deleting...</div>}
            {!isLoading && (
              <div>
                <Button
                  size={'icon'}
                  variant={'ghost'}
                  onClick={() => setShowCreateModal(true)}>
                  <Plus />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size={'icon'} variant={'ghost'}>
                      <Trash />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your collection and all tasks inside from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => {
                          setIsOpen(false);
                        }}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          startTransition(removeCollection);
                        }}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </footer>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

export default CollectionCard;
