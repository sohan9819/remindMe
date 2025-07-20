'use client';
import React from 'react';
import { Collection } from '@/lib/generated/prisma';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CollectionColor, CollectionColors } from '@/lib/constants';
import { useForm } from 'react-hook-form';
import { createTaskSchema, createTaskSchemaType } from '@/schema/createTask';
import { resolve } from 'path';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { Button } from '../ui/button';
import { Calendar as CalendarIcon, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { createTask } from '@/actions/task';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Props {
  open: boolean;
  collection: Collection;
  setOpen: (open: boolean) => void;
}

const CreateTaskDialog = ({ open, setOpen, collection }: Props) => {
  const openChangeWrapper = (value: boolean) => {
    setOpen(value);
    form.reset();
  };
  const router = useRouter();

  const form = useForm<createTaskSchemaType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      collectionId: collection.id,
    },
  });

  const onSubmit = async (data: createTaskSchemaType) => {
    try {
      await createTask(data);
      router.refresh();
      toast.success('Task created successfully!');
      openChangeWrapper(false);
    } catch (error) {
      toast.error('Something went wrong. Please try again later', {
        action: {
          label: 'Try Again',
          onClick: () => onSubmit(data),
        },
      });
      console.log('Error while creating task : ', error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader className='mb-4'>
          <DialogTitle className='flex gap-2'>
            Add task to collection :{' '}
            <span
              className={cn(
                'p=[1px] bg-clip-text text-transparent',
                CollectionColors[collection.color as CollectionColor],
              )}>
              {collection.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            Add a task to your collection. You can add as many tasks as you want
            to a collection.
          </DialogDescription>
        </DialogHeader>
        <div className='mb-4'>
          <Form {...form}>
            <form
              className='space-y-4 flex flex-col'
              onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder='Task content here'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='expiresAt'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expires at</FormLabel>
                    <FormDescription>
                      When should this task expire ?
                    </FormDescription>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'justify-start text-left font-normal w-full',
                              !field.value && 'text-muted-foreground',
                            )}>
                            <CalendarIcon />
                            {field.value && format(field.value, 'PPP')}
                            {!field.value && <span>No expiration</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  disabled={form.formState.isSubmitting}
                  type='submit'
                  className={cn(
                    'w-full dark:text-white text-white',
                    CollectionColors[collection.color as CollectionColor],
                  )}
                  onClick={form.handleSubmit(onSubmit)}>
                  Confirm
                  {form.formState.isSubmitting && (
                    <Loader className='animate-spin' />
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
