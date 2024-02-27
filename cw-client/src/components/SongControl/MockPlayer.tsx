import { Button } from '../ui/button';
import { PlayCircle, Volume } from 'lucide-react';
import { Separator } from '../ui/separator';

const MockPlayer = () => {
  return (
    <div className='w-full fixed bottom-0'>
      <Separator />
      <div className='flex flex-row bg-background relative justify-between px-6 py-3'>
        <div className='flex w-4/5 gap-4 items-center flex-row h-22'>
          <img
            className='dark:block hidden aspect-square object-cover rounded-sm'
            width={60}
            src='/playlist-dark.png'
            alt=''
          />
          <img
            className='dark:hidden block aspect-square object-cover rounded-sm'
            width={60}
            src='/playlist-light.png'
            alt=''
          />
          <div>
            <p className='font-semibold	tracking-tight'></p>

            <Button
              className='p-0 w-fit h-fit font-normal text-xs text-muted-foreground lg:block hidden'
              variant='link'
            ></Button>
          </div>
        </div>
        <div className='flex flex-col w-full items-center justify-between'>
          <div className='flex flex-row items-center justify-center w-32'>
            <PlayCircle
              className='stroke-secondary'
              strokeWidth={1.25}
              size={36}
            />
          </div>
          <div className='flex flex-row gap-3 w-full items-center'>
            <span className='text-sm text-secondary'> -//- </span>
            <div className='h-1 w-full bg-secondary rounded'></div>
            <span className='text-sm text-secondary'> -//- </span>
          </div>
        </div>
        <div className='w-4/5 justify-end flex flex-row items-center gap-1'>
          <Volume className=' stroke-secondary' strokeWidth={1.5} />
          <div className='w-24 h-1 bg-secondary rounded'></div>
        </div>
      </div>
    </div>
  );
};

export default MockPlayer;
