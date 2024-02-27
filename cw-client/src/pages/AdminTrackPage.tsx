import { Trash } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useEffect, useState } from 'react';
import { AlbumService } from '@/services/album.service';
import { IGenre } from '@/types/genre';
import { TrackService } from '@/services/track.service';
import { ITrack } from '@/types/track';
import AddTrackForm from '../components/forms/AddTrackForm';

const AdminTrackPage = () => {
  const [tracks, setTracks] = useState<ITrack[]>([]);
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState<boolean>(false);

  const getTrack = async () => {
    try {
      const data = await TrackService.searchTracks(searchQuery);
      const genreData = await AlbumService.getGenresWithAlbums();
      setTracks(data);
      setGenres(genreData);
      setCreated(false);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  useEffect(() => {
    getTrack();
    console.log(value);
  }, [searchQuery, value, created]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteTrack = async (trackId: string | undefined) => {
    await TrackService.deleteTrack(trackId).then(() => {
      getTrack();
    });
  };

  return (
    <ScrollArea className='flex-grow mb-16'>
      <div className='flex-col items-center'>
        <div className='items-end  flex justify-between pl-10 py-4 pr-8 text-4xl font-semibold '>
          <div>Управление треками</div>
          <div className='flex flex-row gap-3 items-end'>
            <AddTrackForm setCreated={setCreated} />

            <Input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder='Найти трек...'
              className='w-48'
              type='text'
            />
          </div>
        </div>
        <div className='px-10 mt-6 flex justify-center'>
          <Table className=''>
            <TableCaption>Список всех треков</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className=' w-1/3'>Название</TableHead>
                <TableHead className='w-1/4'>Альбом</TableHead>
                <TableHead className='w-1/4'>Исполнитель</TableHead>
                <TableHead className='w-20'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks.map((track) => (
                <TableRow key={track._id}>
                  <TableCell>{track.name}</TableCell>
                  <TableCell>{track.album.name}</TableCell>
                  <TableCell>{track.album.artist.name}</TableCell>
                  <TableCell className=' w-20 text-right'>
                    <Button
                      onClick={() => {
                        handleDeleteTrack(track._id);
                      }}
                      variant='destructive'
                      size='icon'
                    >
                      <Trash width={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScrollArea>
  );
};

export default AdminTrackPage;
