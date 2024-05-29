import { AlbumService } from '@/services/album.service';
import { ArtistService } from '@/services/artist.service';
import { IArtist } from '@/types/artist';
import { IGenre } from '@/types/genre';
import { ChangeEvent, useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { CheckIcon, Plus } from 'lucide-react';
import { useInput } from '@/hooks/useInput';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CaretSortIcon } from '@radix-ui/react-icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../ui/command';
import { cn } from '@/lib/utils';

export interface AddAlbumFormProps {
  setCreated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddAlbumForm: React.FC<AddAlbumFormProps> = ({ setCreated }) => {
  const [genres, setGenres] = useState<IGenre[]>([]);
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [artistValue, setArtistValue] = useState('');
  const [artistOpen, setArtistOpen] = useState(false);

  const getAlbumsWithGenres = async () => {
    try {
      const data = await ArtistService.getAllArtist();
      const genreData = await AlbumService.getGenresWithAlbums();
      setArtists(data);
      setGenres(genreData);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  useEffect(() => {
    getAlbumsWithGenres();
  }, []);

  const albumName = useInput('');
  const albumYear = useInput('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    }
  };

  const handleCreateAlbum = async () => {
    if (
      albumYear.value > 0 &&
      albumYear.value < 2024 &&
      selectedFile &&
      albumName.value &&
      value &&
      artistValue
    ) {
      const formData = new FormData();
      formData.append('picture', selectedFile);
      formData.append('year', albumYear.value);
      formData.append('genreId', value);
      formData.append('artistId', artistValue);
      console.log(artistValue);
      formData.append('name', albumName.value);
      await AlbumService.createAlbum(formData);
      setCreated(true);
    } else {
      alert('Введены не все данные, или данные некорректны');
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='secondary' size='icon'>
          <Plus />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>Добавление альбома</AlertDialogTitle>
          <AlertDialogDescription>
            Введите данные об альбоме
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Название
            </Label>
            <Input {...albumName} id='name' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='year' className='text-right'>
              Год
            </Label>
            <Input
              type='number'
              min={0}
              max={2023}
              {...albumYear}
              id='year'
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label className='items-start text-right'>Жанр</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className='col-span-3 justify-between'
                >
                  {value
                    ? genres.find((genre) => genre._id === value)?.name
                    : 'Выберите жанр...'}
                  <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='p-0'>
                <Command>
                  <CommandInput placeholder='Найти жанр...' className='h-9' />
                  <CommandEmpty>Жанр не найден</CommandEmpty>
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
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label className='items-start text-right'>Исполнитель</Label>
            <Popover open={artistOpen} onOpenChange={setArtistOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className='col-span-3 justify-between'
                >
                  {artistValue
                    ? artists.find((artist) => artist._id === artistValue)?.name
                    : 'Выберите исполнителя...'}
                  <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='p-0'>
                <Command>
                  <CommandInput
                    placeholder='Найти исполнителя...'
                    className='h-9'
                  />
                  <CommandEmpty>Исполнитель не найден</CommandEmpty>
                  <CommandGroup>
                    {artists.map((artist) => (
                      <CommandItem
                        key={artist._id}
                        value={artist._id}
                        onSelect={(currentValue) => {
                          setArtistValue(
                            currentValue === artistValue ? '' : currentValue
                          );
                          setArtistOpen(false);
                        }}
                      >
                        {artist.name}
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            artistValue === artist._id
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='picture' className=' items-start text-right'>
            Обложка
          </Label>
          <Input
            {...selectedFile}
            className=' text-xs col-span-3 !border-none'
            id='picture'
            type='file'
            accept='image/*'
            onChange={handleFileChange}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              handleCreateAlbum();
            }}
          >
            Создать
          </AlertDialogAction>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddAlbumForm;
