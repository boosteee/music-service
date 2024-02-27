import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { IArtist } from '@/types/artist';
import { ArtistService } from '@/services/artist.service';
import ArtistSong from '../components/SongControl/ArtistSong';
import AlbumCard from '../components/AlbumCard';
import { IArtistTrack } from '@/types/track';
import { BASE_URL } from '@/services/constants';

const ArtistPage = () => {
  const { artistId } = useParams();
  const [artist, setArtist] = useState<IArtist | null>(null);
  const [tracks, setTracks] = useState<IArtistTrack[] | null>(null);

  const navigate = useNavigate();

  useMemo(() => {
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
              track: track.track,
              album: album,
              picture: album.picture,
            });
          });
        });
        setArtist(data);
        setTracks(tracksWithCovers);
      } catch (error) {
        console.error('Ошибка при загрузке данных альбома:', error);
      }
    };

    fetchAlbum();
  }, [artistId]);

  const handleAlbumClick = (albumId: string) => {
    navigate(`/albums/${albumId}`);
  };

  return (
    <ScrollArea className='flex-grow'>
      <div className='relative mb-10'>
        <img
          onClick={() => {
            console.log(artist);
          }}
          src={artist?.picture ? `${BASE_URL}/${artist.picture}` : ''}
          className='block brightness-50 h-[32rem] w-full object-cover '
          alt=''
        />
        <p className='absolute bottom-6 left-10 text-gray-50 text-4xl font-bold'>
          {artist?.name}
        </p>
      </div>
      <div className='flex flex-col gap-10'>
        <div className='px-10'>
          <div>
            <p className='text-xl font-semibold mb-3'>Треки</p>
            <div className='flex flex-col gap-0.5'>
              {tracks && tracks.length > 0 ? (
                tracks
                  .slice(0, 5)
                  .map((track) => <ArtistSong key={track._id} track={track} />)
              ) : (
                <p className='text-center text-sm text-muted-foreground'>
                  Треков пока что нет🙁
                </p>
              )}
            </div>
          </div>
        </div>
        <div className='last:mb-20'>
          <p className='px-10 text-xl font-semibold mb-5'>Альбомы</p>
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
