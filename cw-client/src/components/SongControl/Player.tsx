import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import VolumeControl from './VolumeControl';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useActions } from '@/hooks/useActions';
import ProgressControl from './ProgressControl';
import { TrackService } from '@/services/track.service';
import { ITrack } from '@/types/track';
import { useNavigate } from 'react-router-dom';
import MockPlayer from './MockPlayer';
import { BASE_URL } from '@/services/constants';
import { Repeat, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import PlayButton from '@/icons/PlayButton';
import PauseButton from '@/icons/PauseButton';

const Player = () => {
  const { audio, pause, volume, active, duration, currentTime } =
    useTypedSelector((state) => state.player);
  const { tracks, source } = useTypedSelector((state) => state.queue);
  const navigate = useNavigate();
  const {
    pauseTrack,
    playTrack,
    setVolume,
    setCurrentTime,
    setDuration,
    setActiveTrack,
    setQueue,
  } = useActions();

  const [track, setTrack] = useState<ITrack | undefined>();
  const [isShuffled, setShuffled] = useState(false);
  const [isRepeated, setRepeated] = useState(false);
  const [originalTracks, setOriginalTracks] = useState<ITrack[]>([]);

  useEffect(() => {
    if (audio) {
      setAudio();
      play();
    }
  }, [active]);

  useEffect(() => {
    if (tracks) {
      setOriginalTracks(tracks);
      isShuffled && setQueue(shuffleArray(tracks));
    }
  }, [source]);

  const getTrack = async () => {
    if (active) {
      const data = await TrackService.getTrackDetails(active._id);
      setTrack(data);
    }
  };

  const setAudio = () => {
    if (active) {
      audio.src = `${BASE_URL}/tracks/file/${active.track}`;
      getTrack();
      audio.volume = volume / 100;
      audio.onloadedmetadata = () => setDuration(Math.ceil(audio.duration));
      audio.ontimeupdate = () => setCurrentTime(Math.ceil(audio.currentTime));
    }
  };

  audio.onended = () => {
    if (isRepeated) {
      setCurrentTime(0);
      audio.play();
    } else {
      playNextTrack();
    }
  };

  const play = () => {
    if (pause) {
      playTrack();
      audio.play();
    } else {
      pauseTrack();
      audio.pause();
    }
  };

  const playNextTrack = () => {
    if (tracks && active && tracks.length > 1) {
      const currentIndex = tracks.findIndex(
        (track) => track._id === active._id
      );
      const nextIndex = (currentIndex + 1) % tracks.length;
      setActiveTrack(tracks[nextIndex]);
      pauseTrack();
    }
  };

  const playPrevTrack = () => {
    if (tracks && active) {
      const currentIndex = tracks.findIndex(
        (track) => track._id === active._id
      );
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
      setActiveTrack(tracks[prevIndex]);
      pauseTrack();
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

  const shuffleArray = (array: ITrack[]): ITrack[] => {
    return array.slice().sort(() => Math.random() - 0.5);
  };

  const handleShuffleClick = () => {
    if (isShuffled) {
      setQueue(originalTracks);
    } else if (tracks) {
      const shuffledTracks = shuffleArray(tracks);
      setQueue(shuffledTracks);
    }
    setShuffled(!isShuffled);
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
            width={54}
            src={
              track?.album.picture ? `${BASE_URL}/${track.album.picture}` : ''
            }
            alt=''
          />
          <div>
            <p className='font-semibold text-sm tracking-tight'>
              {track?.name}
            </p>
            <p className='text-xs font-medium text-muted-foreground'>
              <span
                className='cursor-pointer hover:underline truncate'
                onClick={() => handleArtistClick(track?.album.artist._id)}
              >
                {track?.album.artist.name}
              </span>
              {track?.feat && track.feat.length > 0 && (
                <>
                  ,{' '}
                  {track.feat.map((artist, index) => (
                    <React.Fragment key={artist._id}>
                      {index > 0 && ', '}
                      <span
                        className='cursor-pointer hover:underline truncate'
                        onClick={() => handleArtistClick(artist._id)}
                      >
                        {artist.name}
                      </span>
                    </React.Fragment>
                  ))}
                </>
              )}
            </p>
          </div>
        </div>
        <div className='flex flex-col w-full items-center justify-between'>
          <div className='flex flex-row items-center gap-2 mb-[0.4rem]'>
            <Button variant='link' size='icon' onClick={handleShuffleClick}>
              <Shuffle
                className={`transition-colors ${
                  isShuffled ? 'stroke-blue-500' : 'stroke-muted-foreground'
                }`}
                size={16}
              />
            </Button>
            <div className='flex flex-row items-center gap-1.5'>
              <Button variant='link' size='icon' onClick={playPrevTrack}>
                <SkipBack
                  className='transition-colors hover:fill-primary fill-muted-foreground stroke-muted-foreground hover:stroke-primary'
                  size={20}
                />
              </Button>
              <Button
                onClick={play}
                variant='link'
                size='icon'
                className='hover:scale-105 transition-transform'
              >
                {pause ? <PlayButton /> : <PauseButton />}
              </Button>
              <Button variant='link' size='icon' onClick={playNextTrack}>
                <SkipForward
                  className='transition-colors hover:fill-primary fill-muted-foreground stroke-muted-foreground hover:stroke-primary'
                  size={20}
                />
              </Button>
            </div>
            <Button
              variant='link'
              size='icon'
              onClick={() => setRepeated(!isRepeated)}
            >
              <Repeat
                className={`transition-colors ${
                  isRepeated ? 'stroke-blue-500' : 'stroke-muted-foreground'
                }`}
                size={16}
              />
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
