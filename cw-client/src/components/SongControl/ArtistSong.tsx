import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { IArtistTrack } from '@/types/track';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { IPlaylist } from '@/types/playlist';
import { PlaylistService } from '@/services/playlist.service';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import { useActions } from '@/hooks/useActions';
import Lottie from 'lottie-react';
import soundwave from '../../lottie/lottie-soundwave.json';
import { formatTime } from '@/lib/utils';
import { BASE_URL } from '@/services/constants';
import Ellipsis from '@/icons/Ellipsis';

interface ArtistSongProps {
  artistId: string | undefined;
  track: IArtistTrack;
  otherArtistTracks: IArtistTrack[];
}

const ArtistSong: React.FC<ArtistSongProps> = ({
  track,
  otherArtistTracks,
  artistId,
}) => {
  const navigate = useNavigate();

  const handleAlbumClick = (albumId: string) => {
    navigate(`/albums/${albumId}`);
  };
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const { pauseTrack, playTrack, setActiveTrack, setQueue, setSource } =
    useActions();
  const { active, pause, audio } = useTypedSelector((state) => state.player);

  const play = () => {
    if (active?._id === track._id) {
      pauseTrack();
    } else {
      pauseTrack();
      setActiveTrack(track);
      artistId && setSource(artistId);
      console.log('id Artist', artistId);
      setQueue(otherArtistTracks);
    }
  };

  const pauseResume = () => {
    if (pause) {
      playTrack();
      audio.play();
    } else {
      pauseTrack();
      audio.pause();
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

  useEffect(() => {
    getPlaylist();
  }, []);

  return (
    <div className='rounded even:bg-muted'>
      <DropdownMenu>
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
                src={track?.album.picture ? `${BASE_URL}/${track.picture}` : ''}
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
                  onClick={() => {
                    pauseResume();
                  }}
                >
                  <Lottie
                    className='group-hover:hidden block rounded-sm'
                    animationData={soundwave}
                    loop={true}
                  />
                  {pause ? (
                    <Play
                      className='stroke-gray-50 fill-gray-50 hidden group-hover:block'
                      size={20}
                    />
                  ) : (
                    <Pause
                      className='stroke-gray-50 fill-gray-50 hidden group-hover:block'
                      size={20}
                    />
                  )}
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
            {track.duration !== undefined &&
              formatTime(Math.ceil(track.duration))}
          </p>
          <DropdownMenuTrigger className='ml-2 opacity-0 transition-opacity group-hover:opacity-100'>
            <Ellipsis />
          </DropdownMenuTrigger>
        </div>

        <DropdownMenuContent className='w-40'>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Добавить в</DropdownMenuSubTrigger>
            <DropdownMenuSubContent className='w-48'>
              <ScrollArea className='max-h-96'>
                {playlists.map((playlist) => (
                  <DropdownMenuItem
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
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ArtistSong;
