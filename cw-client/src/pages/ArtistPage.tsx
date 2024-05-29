import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { IArtist } from '@/types/artist';
import { ArtistService } from '@/services/artist.service';
import ArtistSong from '../components/SongControl/ArtistSong';
import AlbumCard from '../components/AlbumCard';
import { IArtistTrack } from '@/types/track';
import { BASE_URL } from '@/services/constants';
import { Heart } from 'lucide-react';
import { LoginService } from '@/services/login.service';

const ArtistPage = () => {
  const loggedUser = JSON.parse(localStorage.getItem('user') ?? '{}');
  const { user } = loggedUser;
  const { artistId } = useParams();
  const [sub, setSub] = useState(false);
  const [artist, setArtist] = useState<IArtist | null>(null);
  const [tracks, setTracks] = useState<IArtistTrack[] | null>(null);

  const navigate = useNavigate();

  const fetchAlbum = async () => {
    try {
      const tracksWithCovers: IArtistTrack[] = [];
      const data = await ArtistService.getArtistWithALbums(artistId);
      data.albums.forEach((album) => {
        album.tracks.forEach((track) => {
          tracksWithCovers.push({
            _id: track._id,
            name: track.name,
            playlists: track.playlists,
            duration: track.duration,
            track: track.track,
            album: album,
            picture: album.picture,
            feat: track.feat,
          });
        });
      });
      setArtist(data);
      setTracks(tracksWithCovers);
      const subscriptions = await LoginService.getSubs(user.email);
      if (subscriptions.some((artist) => artist._id === artistId)) {
        setSub(true);
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных альбома:', error);
    }
  };

  const getSubs = async () => {
    const subscriptions = await LoginService.getSubs(user.email);
    if (subscriptions.some((artist) => artist._id === artistId)) {
      setSub(true);
    } else {
      setSub(false);
    }
  };

  useMemo(() => {
    getSubs();
    fetchAlbum();
  }, [artistId]);

  const handleAlbumClick = (albumId: string) => {
    navigate(`/albums/${albumId}`);
  };

  const handleSubButton = async () => {
    if (!sub) {
      LoginService.subscribe(artistId, user.email);
    } else {
      LoginService.unsubscribe(artistId, user.email);
    }
    setSub(!sub);
  };

  return (
    <ScrollArea className='flex-grow'>
      <div className='relative mb-10'>
        <img
          src={artist?.picture ? `${BASE_URL}/${artist.picture}` : ''}
          className='block brightness-50 h-[32rem] w-full object-cover '
          alt=''
        />

        <p className='absolute flex felx-row gap-3 bottom-6 left-10 text-gray-50 text-4xl font-bold'>
          {artist?.name}

          <button>
            <Heart
              onClick={() => {
                handleSubButton();
              }}
              className={`w-7 h-7 transition-all ${
                sub ? 'stroke-red-500 fill-red-500' : 'stroke-muted-foreground'
              }`}
            />
          </button>
        </p>
      </div>
      <div className='flex flex-col gap-10'>
        <div className='pl-10 pr-4'>
          <p className='text-xl font-semibold mb-3'>Треки</p>
          <div className='flex flex-col gap-0.5'>
            {tracks && tracks.length > 0 ? (
              tracks
                .slice(0, 5)
                .map((track) => (
                  <ArtistSong
                    key={track._id}
                    track={track}
                    otherArtistTracks={tracks}
                    artistId={artist?._id}
                  />
                ))
            ) : (
              <p className='text-center text-sm text-muted-foreground'>
                Треков пока что нет🙁
              </p>
            )}
          </div>
        </div>
        <div className='last:mb-20'>
          <p className='px-10 text-xl font-semibold mb-5'>Альбомы и синглы</p>
          <ScrollArea className='w-[calc(100vw-18rem)] pb-4'>
            <div className='mx-10 flex gap-6'>
              {artist?.albums && artist.albums.length > 0 ? (
                artist.albums.map((album) => (
                  <AlbumCard
                    onClick={() => {
                      handleAlbumClick(album._id);
                    }}
                    key={album._id}
                    album={album}
                  />
                ))
              ) : (
                <p className='text-center text-sm text-muted-foreground'>
                  Альбомов пока что нет🙁
                </p>
              )}
            </div>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </div>
      </div>
    </ScrollArea>
  );
};

export default ArtistPage;
