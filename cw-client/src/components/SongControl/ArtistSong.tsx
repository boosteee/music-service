import { Play } from 'lucide-react';
import { Button } from '../ui/button';
import { IArtistTrack } from '@/types/track';
import { Navigate, useNavigate } from 'react-router-dom';
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
import { IPlaylist } from '@/types/playlist';
import { PlaylistService } from '@/services/playlist.service';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useActions } from '@/hooks/useActions';
import Lottie from 'lottie-react';
import soundwave from '../../lottie/lottie-soundwave.json';
import { formatTime } from '@/lib/utils';
import { BASE_URL } from '@/services/constants';

interface ArtistSongProps {
  track: IArtistTrack;
}

const ArtistSong: React.FC<ArtistSongProps> = ({ track }) => {
  const navigate = useNavigate();

  const handleAlbumClick = (albumId: string) => {
    console.log('click');
    navigate(`/albums/${albumId}`);
  };
  const [duration, setDuration] = useState<number | undefined>();
  const { playTrack, pauseTrack, setActiveTrack } = useActions();
  const { active, pause } = useTypedSelector((state) => state.player);

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

  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);

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
          <div className='group h-14 flex flex-row items-center pl-2 pr-6 py-2'>
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
                    track?.album.picture ? `${BASE_URL}/${track.picture}` : ''
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
            <div className='w-2/6 flex justify-start'>
              <Button
                onClick={() => {
                  handleAlbumClick(track.album._id);
                }}
                className='text-sm text-muted-foreground'
                variant='link'
              >
                {track.album.name}
              </Button>
            </div>
            <p className='w-1/6 tabular-nums text-sm text-muted-foreground flex justify-end'>
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

export default ArtistSong;
