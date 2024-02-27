import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import ArtistCard from '../components/ArtistCard';
import { ArtistService } from '@/services/artist.service';
import { useMemo, useState } from 'react';
import { IArtist } from '@/types/artist';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';

const ArtistDemoPage = () => {
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  useMemo(() => {
    const getArtist = async () => {
      try {
        const data = await ArtistService.searchArtists(searchQuery);
        setArtists(data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    getArtist();
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleArtistClick = (artistId: string) => {
    console.log('click');
    navigate(`/artists/${artistId}`);
  };

  return (
    <ScrollArea className='flex-grow'>
      <div className='items-end  flex justify-between pl-10 py-4 pr-8 text-4xl font-semibold '>
        <div>Исполнители</div>
        <Input
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder='Найти исполнтиеля...'
          className='w-48'
          type='text'
        ></Input>
      </div>

      <p className='px-10 text-xl font-semibold mb-5 text-muted-foreground'>
        Список исполнителей
      </p>

      <ScrollArea className='w-[calc(100vw-18rem)] pb-4'>
        <div className='mx-10 flex gap-6'>
          {artists && artists.length > 0 ? (
            artists.map((artist) => (
              <ArtistCard
                onClick={() => {
                  handleArtistClick(artist._id);
                }}
                key={artist._id}
                artist={artist}
              />
            ))
          ) : (
            <p className='text-center text-sm text-muted-foreground'>
              Исполнителей пока что нет🙁
            </p>
          )}
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </ScrollArea>
  );
};

export default ArtistDemoPage;
