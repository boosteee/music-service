import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { AddAlbumFormProps } from './AddAlbumForm';
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
import { Button } from '../ui/button';
import { CheckIcon, Plus } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '../ui/command';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import { IAlbum } from '@/types/album';
import { ITrack } from '@/types/track';
import { TrackService } from '@/services/track.service';
import { AlbumService } from '@/services/album.service';
import { useInput } from '@/hooks/useInput';
import { IArtist } from '@/types/artist';
import { ArtistService } from '@/services/artist.service';
import MultipleSelector, {
  MultipleSelectorRef,
  Option,
} from '@/components/ui/multiple-selector';

const AddTrackForm: React.FC<AddAlbumFormProps> = ({ setCreated }) => {
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [, setTracks] = useState<ITrack[]>([]);
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const trackName = useInput('');
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    }
  };

  const multipleSelectorRef = useRef<MultipleSelectorRef>(null);

  const getArtists = async () => {
    const data = await ArtistService.getAllArtist();
    setArtists(data);
  };

  const getTracks = async () => {
    try {
      const data = await TrackService.searchTracks();
      const albumData = await AlbumService.getAllAlbums();
      setTracks(data);
      setAlbums(albumData);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  useEffect(() => {
    getTracks();
    getArtists();
  }, []);

  const convertToOptions = (artists: IArtist[]): Option[] => {
    return artists.map((artist) => ({
      value: artist._id,
      label: artist.name,
    }));
  };

  const artistOptions = convertToOptions(artists);

  const handleCreateTrack = async () => {
    if (
      trackName.value &&
      multipleSelectorRef.current &&
      selectedFile &&
      value
    ) {
      const selectedValue = multipleSelectorRef.current.selectedValue;
      const formatFeat = selectedValue.map((item) => item.value);
      const formData = new FormData();
      formData.append('name', trackName.value);
      formData.append('albumId', value);
      formData.append('track', selectedFile);
      for (let i = 0; i < formatFeat.length; i++) {
        formData.append('feat[]', formatFeat[i]);
        console.log(formatFeat[i]);
      }
      await TrackService.createTrack(formData);
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
          <AlertDialogTitle>Добавление трека</AlertDialogTitle>
          <AlertDialogDescription>
            Введите данные о треке
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Название
            </Label>
            <Input {...trackName} id='name' className='col-span-3' />
          </div>

          <div className='grid grid-cols-4 items-center gap-4'>
            <Label className='items-start text-right'>Альбом</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className='col-span-3 justify-between'
                >
                  {value
                    ? albums.find((album) => album._id === value)?.name
                    : 'Выберите альбом...'}
                  <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='p-0'>
                <Command>
                  <CommandInput placeholder='Найти альбом...' className='h-9' />
                  <CommandEmpty>Альбом не найден</CommandEmpty>
                  <CommandGroup>
                    {albums.map((album) => (
                      <CommandItem
                        key={album._id}
                        value={album._id}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? '' : currentValue);
                          setOpen(false);
                        }}
                      >
                        {album.name}
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            value === album._id ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className='flex items-center gap-4'>
            <Label htmlFor='name' className='ml-14 text-right'>
              Фит
            </Label>
            <MultipleSelector
              ref={multipleSelectorRef}
              hidePlaceholderWhenSelected={true}
              selectFirstItem={false}
              defaultOptions={artistOptions}
              placeholder='Выберите исполнителя...'
              emptyIndicator={
                <p className='text-center text-sm leading-4 text-gray-600 dark:text-gray-400'>
                  Исполнитель не найден
                </p>
              }
            />
          </div>
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='picture' className=' items-start text-right'>
            Аудиозапись
          </Label>
          <Input
            {...selectedFile}
            className=' text-xs col-span-3 !border-none'
            id='picture'
            type='file'
            accept='audio/*'
            onChange={handleFileChange}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              handleCreateTrack();
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

export default AddTrackForm;
