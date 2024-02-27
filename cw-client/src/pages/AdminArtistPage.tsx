import { Plus, Trash } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { BASE_URL } from '@/services/constants';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { ChangeEvent, useEffect, useState } from 'react';
import { ArtistService } from '@/services/artist.service';
import { IArtist } from '@/types/artist';
import { Avatar, AvatarImage } from '../components/ui/avatar';
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
} from '../components/ui/alert-dialog';
import { Label } from '../components/ui/label';
import { useInput } from '@/hooks/useInput';

const AdminArtistPage = () => {
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getArtist = async () => {
    try {
      const data = await ArtistService.searchArtists(searchQuery);
      setArtists(data);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  useEffect(() => {
    getArtist();
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const artistName = useInput('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    }
  };

  const handleDeleteArtist = async (artistId: string | undefined) => {
    await ArtistService.deleteArtist(artistId).then(() => {
      getArtist();
    });
  };

  const handleCreateArtist = async () => {
    if (selectedFile && artistName.value) {
      const formData = new FormData();
      formData.append('picture', selectedFile);
      formData.append('name', artistName.value);
      ArtistService.addArtist(formData).then(() => {
        getArtist();
      });
    } else {
      alert('Введены не все данные');
    }
  };

  return (
    <ScrollArea className='flex-grow mb-16'>
      <div className='flex-col items-center'>
        <div className='items-end  flex justify-between pl-10 py-4 pr-8 text-4xl font-semibold '>
          <div>Управление исполнителями</div>
          <div className='flex flex-row gap-3 items-end'>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='secondary' size='icon'>
                  <Plus />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='sm:max-w-[425px]'>
                <AlertDialogHeader>
                  <AlertDialogTitle>Добавление исполнителя</AlertDialogTitle>
                  <AlertDialogDescription>
                    Введите данные об исполнителе
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label htmlFor='name' className='text-right'>
                      Имя
                    </Label>
                    <Input {...artistName} id='name' className='col-span-3' />
                  </div>
                  <div className='grid grid-cols-4 items-center gap-4'>
                    <Label
                      htmlFor='picture'
                      className=' items-start text-right'
                    >
                      Аватар
                    </Label>
                    <Input
                      className=' text-xs col-span-3 !border-none'
                      id='picture'
                      type='file'
                      accept='image/*'
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={handleCreateArtist}>
                    Создать
                  </AlertDialogAction>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder='Найти исполнтиеля...'
              className='w-48'
              type='text'
            />
          </div>
        </div>
        <div className='px-10 mt-6 flex justify-center'>
          <Table className=''>
            <TableCaption>Список всех исполнителей</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[150px]'>Аватар</TableHead>
                <TableHead>Имя исполнтиеля</TableHead>
                <TableHead className='text-right'>
                  Количество альбомов
                </TableHead>
                <TableHead className='w-20'></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {artists.map((artist) => (
                <TableRow key={artist._id}>
                  <TableCell className='font-medium'>
                    <Avatar>
                      <AvatarImage
                        className='object-cover'
                        src={`${BASE_URL}/${artist.picture}`}
                      />
                    </Avatar>
                  </TableCell>
                  <TableCell>{artist.name}</TableCell>
                  <TableCell className='text-right'>
                    {artist.albums.length}
                  </TableCell>
                  <TableCell className=' w-20 text-right'>
                    <Button
                      onClick={() => {
                        handleDeleteArtist(artist._id);
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

export default AdminArtistPage;
