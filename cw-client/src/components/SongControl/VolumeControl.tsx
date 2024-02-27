import { Volume1 } from 'lucide-react';
import { Slider } from '../ui/slider';
import { TrackProgressProps } from './Player';

const VolumeControl: React.FC<TrackProgressProps> = ({
  left,
  right,
  onChange,
}) => {
  return (
    <div className='w-4/5 justify-end flex flex-row items-center gap-1'>
      <Volume1 strokeWidth={1.5} />
      <Slider
        className='w-24'
        min={0}
        max={right}
        value={[left]}
        onValueChange={onChange}
      />
    </div>
  );
};

export default VolumeControl;
