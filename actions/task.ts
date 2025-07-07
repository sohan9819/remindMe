'use server';

import prisma from '@/lib/prisma';
import { createTaskSchemaType } from '@/schema/createTask';
import { currentUser } from '@clerk/nextjs/server';

export const createTask = async (data: createTaskSchemaType) => {
  const user = await currentUser();

  if (!user) {
    throw new Error('user not found');
  }

  const { collectionId, content, expiresAt } = data;

  return await prisma.task.create({
    data: {
      userId: user.id,
      content,
      expiresAt,
      Collection: {
        connect: {
          id: collectionId,
        },
      },
    },
  });
};

export const setTaskToDone = async (id: number) => {
  const user = await currentUser();

  if (!user) {
    throw new Error('user not found');
  }

  return await prisma.task.update({
    where: {
      id: id,
      userId: user.id,
    },
    data: {
      done: true,
    },
  });
};
