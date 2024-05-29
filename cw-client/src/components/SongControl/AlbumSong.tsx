import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ITrack } from '@/types/track';
import Ellipsis from '@/icons/Ellipsis';
import { Pause, Play } from 'lucide-react';
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
import { PlaylistService } from '@/services/playlist.service';
import { Navigate, useNavigate } from 'react-router-dom';
import { IPlaylist } from '@/types/playlist';
import { useActions } from '@/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import Lottie from 'lottie-react';
import soundwave from '../../lottie/lottie-soundwave.json';
import soundwaveDark from '../../lottie/lottie-soundwave-dark.json';
import { formatTime } from '@/lib/utils';
import React from 'react';

interface AlbumSongProps {
  albumId: string;
  track: ITrack;
  otherAlbumTracks: ITrack[];
}

const AlbumSong: React.FC<AlbumSongProps> = ({
  track,
  otherAlbumTracks,
  albumId,
}) => {
  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);
  const navigate = useNavigate();
  const { pauseTrack, playTrack, setActiveTrack, setQueue, setSource } =
    useActions();
  const { audio, active, pause } = useTypedSelector((state) => state.player);

  const play = () => {
    if (active?._id === track._id) {
      pauseTrack();
    } else {
      pauseTrack();
      setActiveTrack(track);
      setSource(albumId);
      console.log('Id album', albumId);
      setQueue(otherAlbumTracks);
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

  useMemo(() => {
    getPlaylist();
  }, []);

  const handleArtistClick = (artistId: string) => {
    navigate(`/artists/${artistId}`);
  };

  return (
    <div className='rounded even:bg-muted'>
      <DropdownMenu>
        <div className='group h-14 flex flex-row items-center  pl-2 pr-6 py-2'>
          <div className='ml-1 flex w-3/6 flex-row gap-3 items-center'>
            {active?._id !== track._id ? (
              <Button
                onClick={() => {
                  play();
                }}
                className='transition-opacity'
                variant='link'
                size='icon'
              >
                <Play className='fill-primary' size={20} />
              </Button>
            ) : (
              <Button
                className='transition-opacity'
                variant='link'
                size='icon'
                onClick={() => {
                  pauseResume();
                }}
              >
                <Lottie
                  className='group-hover:hidden dark:block hidden rounded-sm'
                  animationData={soundwave}
                  loop={true}
                />
                <Lottie
                  className='dark:hidden group-hover:hidden rounded-sm'
                  animationData={soundwaveDark}
                  loop={true}
                />
                {pause ? (
                  <Play
                    className='stroke-primary fill-primary hidden group-hover:block'
                    size={20}
                  />
                ) : (
                  <Pause
                    className='stroke-primary fill-primary hidden group-hover:block'
                    size={20}
                  />
                )}
              </Button>
            )}
            <p
              className={
                active?._id !== track._id
                  ? 'text-sm font-semibold'
                  : 'text-transparent text-sm font-semibold bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600'
              }
            >
              {track.name}
            </p>
          </div>
          <p className='w-1/6 text-sm text-muted-foreground'>
            {track.feat && track.feat.length > 0 && (
              <>
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
          <p className='tabular-nums w-2/6 text-sm text-muted-foreground flex justify-end'>
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

export default AlbumSong;
