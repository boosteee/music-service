import { IPlaylist } from '@/types/playlist';
import { ScrollArea, ScrollBar } from '../components/ui/scroll-area';
import { ChangeEvent, useMemo, useState } from 'react';
import { PlaylistService } from '@/services/playlist.service';
import { Navigate, useNavigate } from 'react-router-dom';
import PlaylistCard from '../components/PlaylistCard';
import { Button } from '../components/ui/button';
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
import { Input } from '../components/ui/input';
import { useInput } from '@/hooks/useInput';
import { LoginService } from '@/services/login.service';

const LibraryPage = () => {
  const navigate = useNavigate();
  const handlePlaylistClick = (playlistId: string) => {
    navigate(`/playlists/${playlistId}`);
  };

  const [playlists, setPlaylists] = useState<IPlaylist[]>([]);

  const loggedUser = JSON.parse(localStorage.getItem('user') ?? '{}');

  if (!loggedUser) {
    return <Navigate to='/login' />;
  }
  const { user } = loggedUser;

  const getPlaylist = async () => {
    if (!user.email) {
      return;
    }
    const data = await PlaylistService.getPlaylistByUserEmail(user.email);
    setPlaylists(data);
  };

  useMemo(() => {
    getPlaylist();
  }, []);

  const playlistName = useInput('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    }
  };

  const handleFormSubmit = async () => {
    if (selectedFile && playlistName.value) {
      if (!user.email) {
        return;
      }
      const targetUser = await LoginService.getUserByEmail(user.email);
      const formData = new FormData();
      formData.append('userId', targetUser._id);
      formData.append('picture', selectedFile);
      formData.append('name', playlistName.value);
      PlaylistService.createPlaylist(formData).then(() => {
        getPlaylist();
      });
    } else {
      alert('Невозможно создать плейлист без названия или обложки');
    }
  };

  return (
    <ScrollArea className='flex-grow'>
      <div className='items-end flex justify-between pl-10 py-4 pr-8 text-4xl font-semibold'>
        <div>
          Добро пожаловать{' '}
          <span className='font-semibold text-transparent  bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600'>
            {user.username}
          </span>
          !
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className='text-sm' variant='outline'>
              Создать плейлист
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='sm:max-w-[425px]'>
            <AlertDialogHeader>
              <AlertDialogTitle>Создание плейлиста</AlertDialogTitle>
              <AlertDialogDescription>
                Введите данные о плейлисте
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  Название
                </Label>
                <Input {...playlistName} id='name' className='col-span-3' />
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='picture' className=' items-start text-right'>
                  Обложка
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
              <AlertDialogAction onClick={handleFormSubmit}>
                Создать
              </AlertDialogAction>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <p className='px-10 text-xl font-semibold mb-5 text-muted-foreground'>
        Плейлисты
      </p>

      <ScrollArea className='w-[calc(100vw-18rem)] pb-4'>
        <div className='mx-10 flex gap-6'>
          {playlists && playlists.length > 0 ? (
            playlists.map((playlist) => (
              <PlaylistCard
                onClick={() => {
                  handlePlaylistClick(playlist._id);
                }}
                key={playlist._id}
                playlist={playlist}
              />
            ))
          ) : (
            <p className='text-center text-sm text-muted-foreground'>
              У вас пока нет плейлистов🙁
            </p>
          )}
        </div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </ScrollArea>
  );
};

export default LibraryPage;
