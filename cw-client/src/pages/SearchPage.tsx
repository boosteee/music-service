import { useMemo, useState } from 'react';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { ITrack } from '@/types/track';
import { useNavigate } from 'react-router-dom';
import { TrackService } from '@/services/track.service';
import { Button } from '../components/ui/button';

const SearchPage = () => {
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useMemo(() => {
    const getArtist = async () => {
      try {
        const data = await TrackService.searchTracks(searchQuery);
        setTracks(data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    getArtist();
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleTrackClick = (albumId: string) => {
    navigate(`/albums/${albumId}`);
  };

  return (
    <ScrollArea className='flex-grow'>
      <div className='mt-32 flex gap-5 flex-col items-center'>
        <p className='font-bold text-4xl'>Sonora</p>
        <Input
          value={searchQuery}
          onChange={handleSearchChange}
          className='rounded-lg h-10 w-2/4'
          placeholder='Введите название трека...'
          type='text'
        ></Input>

        {searchQuery && (
          <ScrollArea className='rounded-lg h-96 w-1/2'>
            <div className='flex flex-col '>
              {tracks && tracks.length > 0 ? (
                tracks.map((track) => (
                  <Button
                    onClick={() => {
                      handleTrackClick(track.album._id);
                    }}
                    key={track._id}
                    variant='ghost'
                  >
                    {track.name} — {track.album.name} —{' '}
                    {track.album.artist.name}
                  </Button>
                ))
              ) : (
                <p className='w-full text-center text-muted-foreground'>
                  Трек не найден🙁
                </p>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
    </ScrollArea>
  );
};

export default SearchPage;
