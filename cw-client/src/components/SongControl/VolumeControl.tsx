import { VolumeX, Volume1, Volume2 } from 'lucide-react';
import { Slider } from '../ui/slider';
import { TrackProgressProps } from './Player';
import { useState } from 'react';
import { Button } from '../ui/button';

const VolumeControl: React.FC<TrackProgressProps> = ({
  left,
  right,
  onChange,
}) => {
  let volumeIcon;

  const [isMuted, setIsMuted] = useState(left === 0);
  const [previousVolume, setPreviousVolume] = useState(left);

  const handleIconClick = () => {
    if (isMuted) {
      onChange([previousVolume]);
      setIsMuted(false);
    } else {
      setPreviousVolume(left);
      setIsMuted(true);
      onChange([0]);
    }
  };

  const handleSliderChange = (value: number[]) => {
    const newVolume = value[0];
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
    onChange(value);
  };

  switch (true) {
    case left === 0:
      volumeIcon = (
        <VolumeX className='stroke-muted-foreground' strokeWidth={1.5} />
      );
      break;
    case left < 50:
      volumeIcon = (
        <Volume1 className='stroke-muted-foreground' strokeWidth={1.5} />
      );
      break;
    case left <= 100:
      volumeIcon = (
        <Volume2 className='stroke-muted-foreground' strokeWidth={1.5} />
      );
      break;
    default:
      break;
  }

  return (
    <div className='w-4/5 justify-end flex flex-row items-center gap-0.5'>
      <Button variant='link' size='icon' onClick={handleIconClick}>
        {volumeIcon}
      </Button>
      <Slider
        className='w-24 hover:cursor-pointer'
        min={0}
        max={right}
        value={[left]}
        onValueChange={handleSliderChange}
      />
    </div>
  );
};

export default VolumeControl;
