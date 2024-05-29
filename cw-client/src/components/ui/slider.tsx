import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'group relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className='relative h-1 w-full grow overflow-hidden rounded-full bg-primary/20 '>
      <SliderPrimitive.Range className='group-hover:bg-blue-500 absolute h-full bg-primary rounded-full transition-colors duration-100' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className='group-hover:opacity-100 block opacity-0 h-3 w-3 rounded-full bg-foreground shadow transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50' />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
