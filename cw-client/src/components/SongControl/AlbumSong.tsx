import { Button } from '@/components/ui/button';
import { ITrack } from '@/types/track';
import { Play } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '../ui/context-menu';
import { ScrollArea } from '../ui/scroll-area';
import { useEffect, useMemo, useState } from 'react';
import { PlaylistService } from '@/services/playlist.service';
import { Navigate } from 'react-router-dom';
import { IPlaylist } from '@/types/playlist';
import { useActions } from '@/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import Lottie from 'lottie-react';
import soundwave from '../../lottie/lottie-soundwave.json';
import soundwaveDark from '../../lottie/lottie-soundwave-dark.json';
import { formatTime } from '@/lib/utils';
import { BASE_URL } from '@/services/constants';

interface AlbumSongProps {
  track: ITrack;
}

const AlbumSong: React.FC<AlbumSongProps> = ({ track }) => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
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

  const loggedUser = JSON.parse(localStorage.getItem('user') ?? '{}');

  if (!loggedUser) {
    return <Navigate to='/login' />;
  }
  const { user } = loggedUser;

  const getPlaylist = async () => {
    if (!user.email) {
      return;
    }
    const data = await PlaylistService.getPlaylistByUserEmail(user.email);
    setPlaylists(data);
  };

  useMemo(() => {
    getPlaylist();
  }, []);

  return (
    <div className='rounded even:bg-muted'>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className='group h-14 flex flex-row items-center  pl-2 pr-6 py-2'>
            <div className='ml-1 flex w-4/5 flex-row gap-3 items-center'>
              {active?._id !== track._id ? (
                <Button
                  onClick={() => {
                    play();
                  }}
                  className='  transition-opacity'
                  variant='link'
                  size='icon'
                >
                  <Play className='fill-primary' size={20} />
                </Button>
              ) : (
                <Button
                  className=' transition-opacity'
                  variant='link'
                  size='icon'
                >
                  <Lottie
                    className='hidden dark:block rounded-sm'
                    animationData={soundwave}
                    loop={true}
                  />
                  <Lottie
                    className='dark:hidden rounded-sm'
                    animationData={soundwaveDark}
                    loop={true}
                  />
                </Button>
              )}
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
            <p className='tabular-nums w-1/5 text-sm text-muted-foreground flex justify-end'>
              {duration !== undefined && formatTime(Math.ceil(duration))}
            </p>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className='w-40'>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Добавить в</ContextMenuSubTrigger>
            <ContextMenuSubContent className='w-48'>
              <ScrollArea className='max-h-96'>
                {playlists.map((playlist) => (
                  <ContextMenuItem
                    onClick={() => {
                      PlaylistService.addTrackToPlaylist(
                        playlist._id,
                        track._id
                      );
                      console.log('ДОБАВЛЕНО');
                    }}
                    key={playlist._id}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      className='mr-2 h-4 w-4'
                      viewBox='0 0 24 24'
                    >
                      <path d='M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 12H3M16 6H3M12 18H3' />
                    </svg>
                    {playlist.name}
                  </ContextMenuItem>
                ))}
              </ScrollArea>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default AlbumSong;
