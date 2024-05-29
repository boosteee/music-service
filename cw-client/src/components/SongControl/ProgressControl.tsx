import React from 'react';
import { TrackProgressProps } from './Player';
import { Slider } from '../ui/slider';
import { formatTime } from '@/lib/utils';

const ProgressControl: React.FC<TrackProgressProps> = ({
  left,
  right,
  onChange,
}) => {
  return (
    <div className='flex flex-row gap-3 w-full items-center'>
      <span className='text-xs font-semibold tabular-nums text-muted-foreground'>
        {formatTime(left)}
      </span>
      <Slider
        min={0}
        max={right}
        value={[left]}
        onValueChange={onChange}
        className='h-1 hover:cursor-pointer'
      />
      <span className='text-xs font-semibold tabular-nums text-muted-foreground'>
        {formatTime(right)}
      </span>
    </div>
  );
};

export default ProgressControl;
