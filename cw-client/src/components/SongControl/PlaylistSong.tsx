import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '../ui/context-menu';
import { BASE_URL } from '@/services/constants';
import { ITrack } from '@/types/track';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PlaylistService } from '@/services/playlist.service';
import { useActions } from '@/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import Lottie from 'lottie-react';

import soundwave from '../../lottie/lottie-soundwave.json';
import { formatTime } from '@/lib/utils';

interface PlaylistSongProps {
  track: ITrack;
  playlistId: string | undefined;
  setDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  active?: boolean;
}

const PlaylistSong: React.FC<PlaylistSongProps> = ({
  track,
  playlistId,
  setDeleted,
}) => {
  const navigate = useNavigate();
  const { pauseTrack, setActiveTrack } = useActions();
  const { active } = useTypedSelector((state) => state.player);
  const [duration, setDuration] = useState<number | undefined>();

  useEffect(() => {
    const filePathOnServer = `${BASE_URL}/${track.track}`;
    const audio = new Audio(filePathOnServer);

    const handleLoadedMetadata = () => {
      // Получаем длительность в секундах
      const durationInSeconds = audio.duration;
      console.log(durationInSeconds);
      setDuration(durationInSeconds);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Необходимо вызвать load, чтобы начать загрузку метаданных аудио
    audio.load();

    return () => {
      // Удаляем обработчик события при размонтировании компонента
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  const play = () => {
    if (active?._id === track._id) {
      pauseTrack();
    } else {
      console.log('song song');
      pauseTrack();
      setActiveTrack(track);
    }
  };

  const handleAlbumClick = (albumId: string) => {
    navigate(`/albums/${albumId}`);
  };

  const handleArtistClick = (artistId: string) => {
    navigate(`/artists/${artistId}`);
  };

  const handleDeleteTrackFromPlaylist = async () => {
    await PlaylistService.deleteTrackFromPlaylist(playlistId, track._id);
    setDeleted(true);
  };

  return (
    <div className='rounded even:bg-muted'>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className='group h-14 flex flex-row gap-3 items-center pl-2 pr-6 py-2'>
            <div className='flex w-3/6 flex-row gap-3 items-center'>
              <div className='relative'>
                <img
                  className={
                    active?._id !== track._id
                      ? 'transition-all object-cover aspect-square block rounded min-w-[40px]'
                      : ' brightness-50 transition-all object-cover aspect-square block rounded min-w-[40px]'
                  }
                  width={40}
                  src={
                    track?.album.picture
                      ? `${BASE_URL}/${track.album.picture}`
                      : ''
                  }
                  alt=''
                />
                {active?._id !== track._id ? (
                  <Button
                    onClick={() => {
                      play();
                    }}
                    className='opacity-0 group-hover:opacity-100 transition-opacity absolute left-0.5 top-0.5'
                    variant='link'
                    size='icon'
                  >
                    <Play size={20} className=' stroke-gray-50 fill-gray-50' />
                  </Button>
                ) : (
                  <Button
                    className='absolute left-0.5 top-0.5'
                    variant='link'
                    size='icon'
                  >
                    <Lottie
                      className='rounded-sm'
                      animationData={soundwave}
                      loop={true}
                    />

                    {/* <Pause size={20} className=' stroke-gray-50 fill-gray-50' /> */}
                  </Button>
                )}
              </div>
              <p
                className={
                  active?._id !== track._id
                    ? 'text-sm font-semibold'
                    : 'text-transparent text-sm font-semibold  bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600'
                }
              >
                {track.name}
              </p>
            </div>

            <p
              onClick={() => {
                handleAlbumClick(track.album._id);
              }}
              className=' cursor-pointer hover:underline truncate w-2/6 text-sm text-muted-foreground'
            >
              {track.album.name}
            </p>
            <p
              onClick={() => {
                handleArtistClick(track.album.artist._id);
              }}
              className='cursor-pointer hover:underline truncate w-2/6 text-sm text-muted-foreground'
            >
              {track.album.artist.name}
            </p>

            <p className='w-1/6 tabular-nums text-sm text-muted-foreground flex justify-end'>
              {duration !== undefined && formatTime(Math.ceil(duration))}
            </p>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className='w-40'>
          <ContextMenuItem
            onClick={() => {
              handleDeleteTrackFromPlaylist();

              console.log('deleted');
            }}
          >
            Удалить из плейлиста
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default PlaylistSong;
