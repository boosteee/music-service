import { IAlbum } from '@/types/album';
import { ScrollArea, ScrollBar } from '../components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { AlbumService } from '@/services/album.service';
import AlbumCard from '../components/AlbumCard';
import { Input } from '../components/ui/input';
import { useNavigate } from 'react-router-dom';

const AlbumDemoPage = () => {
  const navigate = useNavigate();

  const handleAlbumClick = (albumId: string) => {
    navigate(`/albums/${albumId}`);
  };

  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getAlbums = async () => {
      try {
        const data = await AlbumService.searchAlbums(searchQuery);
        setAlbums(data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    getAlbums();
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <ScrollArea className='flex-grow'>
      <div className=' items-end flex justify-between pl-10 py-4 pr-8 text-4xl font-semibold'>
        <div>Альбомы</div>
        <Input
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Найти альбом...'
          className='w-48'
          type='text'
        ></Input>
      </div>
      <p className='px-10 text-xl font-semibold mb-5 text-muted-foreground'>
        Список альбомов
      </p>
      <ScrollArea className='w-[calc(100vw-18rem)] pb-4'>
        <div className='mx-10 flex gap-6'>
          {albums && albums.length > 0 ? (
            albums.map((album) => (
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
    </ScrollArea>
  );
};

export default AlbumDemoPage;
