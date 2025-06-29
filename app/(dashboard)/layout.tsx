import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex min-h-screen w-full flex-col items-center'>
      <div className='flex grow w-full justify-center dark:bg-neutral-950'>
        <div className='max-w-[920px] flex flex-col grow px-4 py-2'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
