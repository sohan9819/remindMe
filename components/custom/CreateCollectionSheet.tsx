import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '../ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import {
  createCollectionSchema,
  createCollectionSchemaType,
} from '@/schema/createCollection';
import { zodResolver } from '@hookform/resolvers/zod';
import { CollectionColor, CollectionColors } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { createCollection } from '@/actions/collection';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateCollectionSheet = ({ open, onOpenChange }: Props) => {
  const form = useForm<createCollectionSchemaType>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {},
  });

  const router = useRouter();

  const onSubmit = async (data: createCollectionSchemaType) => {
    try {
      await createCollection(data);
      router.refresh();
      openChangeWrapper(false);
      toast.success('Collection created successfully!');
    } catch (error) {
      openChangeWrapper(false);
      toast.error('Something went wrong. Please try again later', {
        action: {
          label: 'Try Again',
          onClick: () => onSubmit(data),
        },
      });
      console.log('Error while creating a collection : ', error);
    }
  };

  const openChangeWrapper = (open: boolean) => {
    console.log('Form reset ');
    form.reset();
    onOpenChange(open);
  };

  return (
    <Sheet open={open} onOpenChange={openChangeWrapper}>
      <SheetContent className='px-4'>
        <SheetHeader className='text-center'>
          <SheetTitle>Add new collection</SheetTitle>
          <SheetDescription>
            Collections are a way to group your tasks
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Personal' {...field} />
                  </FormControl>
                  <FormDescription>Collection name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='color'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Select onValueChange={(color) => field.onChange(color)}>
                      <SelectTrigger
                        className={cn(
                          'w-full h-8 text-white',
                          CollectionColors[field.value as CollectionColor],
                        )}>
                        <SelectValue placeholder='Color' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Color </SelectLabel>
                          {Object.keys(CollectionColors).map((color, index) => {
                            return (
                              <SelectItem
                                key={index}
                                className={cn(
                                  'w-full h-8 rounded-md text-white focus:text-white focus:font-bold focus:ring-2 ring-neutral-600 focus:ring-inset dark:focus:ring-white focus:px-8 my-2',
                                  CollectionColors[color as CollectionColor],
                                )}
                                value={color}>
                                {color}
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select a color for your collection{' '}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className='flex flex-col gap-3'>
          <Separator />
          <Button
            type='submit'
            variant={'outline'}
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className={cn(
              CollectionColors[
                form.watch('color', form.getValues('color')) as CollectionColor
              ],
            )}>
            Confirm
            {form.formState.isSubmitting && <Loader className='animate-spin' />}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateCollectionSheet;
