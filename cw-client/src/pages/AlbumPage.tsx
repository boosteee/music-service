import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AlbumService } from '@/services/album.service';
import { IAlbum } from '@/types/album';
import AlbumSong from '../components/SongControl/AlbumSong';
import { BASE_URL } from '@/services/constants';

const AlbumPage = () => {
  const { albumId } = useParams();
  const [album, setAlbum] = useState<IAlbum | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const data = await AlbumService.getAlbumById(albumId);
        setAlbum(data);
      } catch (error) {
        console.error('Ошибка при загрузке данных альбома:', error);
      }
    };

    fetchAlbum();
  }, [albumId]);

  const handleArtistClick = (artistId: string | undefined) => {
    navigate(`/artists/${artistId}`);
  };

  return (
    <ScrollArea className='flex-grow'>
      <div className='ml-10 mr-4'>
        <div className='flex flex-row gap-6 my-10 h-64 '>
          <img
            className='object-cover shadow-xl block aspect-square rounded-md'
            src={album?.picture ? `${BASE_URL}/${album.picture}` : ''}
          />
          <div className='h-full flex flex-col gap-0.5 pt-14'>
            <p className='text-3xl font-semibold'>{album?.name}</p>
            <Button
              onClick={() => {
                handleArtistClick(album?.artist._id);
              }}
              className='p-0 w-fit font-normal text-2xl text-muted-foreground'
              variant='link'
            >
              {album?.artist.name}
            </Button>
            <p className=' text-xs font-bold'>
              <span className='uppercase'>{album?.genre.name}</span>
              <span>•</span>
              <span>{album?.year}</span>
            </p>
          </div>
        </div>
        <div className='flex flex-col gap-0.5 '>
          {album?.tracks && album?.tracks.length > 0 ? (
            album?.tracks.map((track) => (
              <AlbumSong
                key={track._id}
                track={track}
                otherAlbumTracks={album.tracks}
                albumId={album._id}
              />
            ))
          ) : (
            <p className='text-center text-sm text-muted-foreground'>
              Треков пока что нет🙁
            </p>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default AlbumPage;
