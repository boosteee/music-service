import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { BASE_URL } from '@/services/constants';
import { ITrack } from '@/types/track';
import { useNavigate } from 'react-router-dom';
import { PlaylistService } from '@/services/playlist.service';
import { useActions } from '@/hooks/useActions';
import { useTypedSelector } from '@/hooks/useTypedSelector';
import Lottie from 'lottie-react';
import soundwave from '../../lottie/lottie-soundwave.json';
import { formatTime } from '@/lib/utils';
import React from 'react';
import Ellipsis from '@/icons/Ellipsis';

interface PlaylistSongProps {
  track: ITrack;
  playlistId: string | undefined;
  setDeleted: React.Dispatch<React.SetStateAction<boolean>>;
  active?: boolean;
  otherPlaylistTracks: ITrack[];
}

const PlaylistSong: React.FC<PlaylistSongProps> = ({
  track,
  playlistId,
  setDeleted,
  otherPlaylistTracks,
}) => {
  const navigate = useNavigate();
  const { pauseTrack, playTrack, setActiveTrack, setQueue, setSource } =
    useActions();
  const { active, pause, audio } = useTypedSelector((state) => state.player);

  const play = () => {
    if (active?._id === track._id) {
      pauseTrack();
    } else {
      pauseTrack();
      setActiveTrack(track);
      playlistId && setSource(playlistId);
      setQueue(otherPlaylistTracks);
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
      <DropdownMenu>
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
                      className=' stroke-gray-50 fill-gray-50 hidden group-hover:block'
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

          <p
            onClick={() => {
              handleAlbumClick(track.album._id);
            }}
            className=' cursor-pointer hover:underline truncate w-2/6 text-sm text-muted-foreground'
          >
            {track.album.name}
          </p>
          <p className='w-2/6 text-sm text-muted-foreground'>
            <span
              className='cursor-pointer hover:underline truncate'
              onClick={() => {
                handleArtistClick(track.album.artist._id);
              }}
            >
              {track.album.artist.name}
            </span>
            {track.feat && track.feat.length > 0 && (
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

          <p className='w-1/6 tabular-nums text-sm text-muted-foreground flex justify-end'>
            {track.duration !== undefined &&
              formatTime(Math.ceil(track.duration))}
          </p>
          <DropdownMenuTrigger className='ml-2 opacity-0 transition-opacity group-hover:opacity-100'>
            <Ellipsis />
          </DropdownMenuTrigger>
        </div>

        <DropdownMenuContent className='w-44'>
          <DropdownMenuItem
            onClick={() => {
              handleDeleteTrackFromPlaylist();
              console.log('deleted');
            }}
          >
            Удалить из плейлиста
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PlaylistSong;
