import { PauseCircle, PlayCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import VolumeControl from './VolumeControl';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useActions } from '@/hooks/useActions';
import { useEffect, useState } from 'react';
import ProgressControl from './ProgressControl';
import { TrackService } from '@/services/track.service';
import { ITrack } from '@/types/track';
import { useNavigate } from 'react-router-dom';
import MockPlayer from './MockPlayer';
import { BASE_URL } from '@/services/constants';

export interface TrackProgressProps {
  left: number;
  right: number;
  onChange: (e: any) => void;
}

let audio: HTMLAudioElement;

const Player = () => {
  const { pause, volume, active, duration, currentTime } = useTypedSelector(
    (state) => state.player
  );

  const navigate = useNavigate();

  const { pauseTrack, playTrack, setVolume, setCurrentTime, setDuration } =
    useActions();

  const [track, setTrack] = useState<ITrack | undefined>();

  useEffect(() => {
    if (!audio) {
      audio = new Audio();
    } else {
      setAudio();
      play();
    }
  }, [active]);

  const getSong = async () => {
    const data = await TrackService.getTrackDetails(active?._id);
    console.log(data);
    setTrack(data);
  };

  const setAudio = () => {
    if (active) {
      audio.src = `${BASE_URL}/` + active.track;
      getSong();
      audio.volume = volume / 100;
      audio.onloadedmetadata = () => {
        setDuration(Math.ceil(audio.duration));
      };
      audio.ontimeupdate = () => {
        setCurrentTime(Math.ceil(audio.currentTime));
      };
    }
  };

  const play = () => {
    if (pause) {
      playTrack();
      audio.play();
      console.log('play');
    } else {
      pauseTrack();
      audio.pause();
      console.log('pause');
    }
  };

  const changeVolume = (e: any) => {
    const [value] = e;
    audio.volume = Number(value) / 100;
    setVolume(Number(value));
  };

  const changeCurrentTime = (e: any) => {
    const [value] = e;
    audio.currentTime = Number(value);
    setCurrentTime(Number(value));
  };

  const handleArtistClick = (artistId: string | undefined) => {
    navigate(`/artists/${artistId}`);
  };

  if (!active) {
    return <MockPlayer />;
  }

  return (
    <div className='w-full fixed bottom-0'>
      <Separator />
      <div className='flex flex-row bg-background relative justify-between px-6 py-3'>
        <div className='flex w-4/5 gap-4 items-center flex-row h-22'>
          <img
            className='block aspect-square object-cover rounded-sm'
            width={60}
            src={
              track?.album.picture ? `${BASE_URL}/${track.album.picture}` : ''
            }
            alt=''
          />
          <div>
            <p className='font-semibold	tracking-tight'>{track?.name}</p>

            <Button
              onClick={() => {
                handleArtistClick(track?.album.artist._id);
              }}
              className='p-0 w-fit h-fit font-normal text-xs text-muted-foreground lg:block hidden'
              variant='link'
            >
              {track?.album.artist.name}
            </Button>
          </div>
        </div>
        <div className='flex flex-col w-full items-center justify-between'>
          <div className='flex flex-row items-center justify-center w-32'>
            <Button
              onClick={() => {
                play();
              }}
              variant='link'
              size='icon'
            >
              {pause ? (
                <PlayCircle strokeWidth={1.25} size={36} />
              ) : (
                <PauseCircle strokeWidth={1.25} size={36} />
              )}
            </Button>
          </div>
          <ProgressControl
            left={currentTime}
            right={duration}
            onChange={changeCurrentTime}
          />
        </div>
        <VolumeControl left={volume} right={100} onChange={changeVolume} />
      </div>
    </div>
  );
};

export default Player;
