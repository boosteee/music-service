import { CheckIcon, Trash } from 'lucide-react';
import { BASE_URL } from '@/services/constants';
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
import { Avatar, AvatarImage } from '../components/ui/avatar';
import { IAlbum } from '@/types/album';
import { AlbumService } from '@/services/album.service';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../components/ui/command';
import { cn } from '@/lib/utils';
import { IGenre } from '@/types/genre';
import { CaretSortIcon } from '@radix-ui/react-icons';
import AddArtistForm from '../components/forms/AddAlbumForm';
import AddGenreForm from '../components/forms/AddGenreForm';

const AdminAlbumPage = () => {
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState<boolean>(false);

  const getAlbum = async () => {
    try {
      const data = await AlbumService.searchAlbums(searchQuery, value);
      const genreData = await AlbumService.getGenresWithAlbums();
      setAlbums(data);
      setGenres(genreData);
      setCreated(false);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  useEffect(() => {
    getAlbum();
  }, [searchQuery, value, created]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleDeleteAlbum = async (albumId: string | undefined) => {
    await AlbumService.deleteAlbum(albumId).then(() => {
      getAlbum();
    });
  };

  return (
    <ScrollArea className='flex-grow mb-16'>
      <div className='flex-col items-center'>
        <div className='items-end  flex justify-between pl-10 py-4 pr-8 text-4xl font-semibold '>
          <div>Управление альбомами</div>
          <div className='flex flex-row gap-3 items-end'>
            <AddArtistForm setCreated={setCreated} />
            <AddGenreForm setCreated={setCreated} />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className='w-[200px] justify-between'
                >
                  {value
                    ? genres.find((genre) => genre._id === value)?.name
                    : 'Выберите жанр...'}
                  <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[200px] p-0'>
                <Command>
                  <CommandInput placeholder='Найти жанр...' className='h-9' />
                  <CommandEmpty>No genre found.</CommandEmpty>
                  <CommandGroup>
                    {genres.map((genre) => (
                      <CommandItem
                        key={genre._id}
                        value={genre._id}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? '' : currentValue);
                          setOpen(false);
                        }}
                      >
                        {genre.name}
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            value === genre._id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>

            <Input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder='Найти альбом...'
              className='w-48'
              type='text'
            />
          </div>
        </div>
        <div className='px-10 mt-6 flex justify-center'>
          <Table className=''>
            <TableCaption>Список всех альбомов</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[150px]'>Обложка</TableHead>
                <TableHead className='w-1/4'>Название</TableHead>
                <TableHead className='w-1/4'>Исполнитель</TableHead>
                <TableHead className='w-1/5'>Жанр</TableHead>
                <TableHead className='text-right'>Количество треков</TableHead>
                <TableHead className='w-20'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {albums.map((album) => (
                <TableRow key={album._id}>
                  <TableCell className='font-medium'>
                    <Avatar>
                      <AvatarImage
                        className='rounded object-cover'
                        src={`${BASE_URL}/${album.picture}`}
                      />
                    </Avatar>
                  </TableCell>
                  <TableCell>{album.name}</TableCell>
                  <TableCell>{album.artist.name}</TableCell>
                  <TableCell>{album.genre.name}</TableCell>
                  <TableCell className='text-right'>
                    {album.tracks.length}
                  </TableCell>
                  <TableCell className=' w-20 text-right'>
                    <Button
                      onClick={() => {
                        handleDeleteAlbum(album._id);
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

export default AdminAlbumPage;
