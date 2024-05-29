import { Pencil, Trash } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { IPlaylist } from '@/types/playlist';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ChangeEvent, useEffect, useState } from 'react';
import { PlaylistService } from '@/services/playlist.service';
import PlaylistSongsHeader from '../components/SongControl/PlaylistSongsHeader';
import PlaylistSong from '../components/SongControl/PlaylistSong';
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
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useInput } from '@/hooks/useInput';
import { BASE_URL } from '@/services/constants';

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState<IPlaylist | null>(null);
  const [deleted, setDeleted] = useState<boolean>(false);

  const loggedUser = JSON.parse(localStorage.getItem('user') ?? '{}');
  if (!loggedUser) {
    return <Navigate to='/login' />;
  }

  const fetchPlaylist = async () => {
    try {
      const data = await PlaylistService.getPlaylistDetails(playlistId);
      setPlaylist(data);
      setDeleted(false);
      console.log(data);
    } catch (error) {
      console.error('Ошибка при загрузке данных альбома:', error);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId, deleted]);

  const playlistName = useInput('');
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
    }
  };

  const handleFormSubmit = async () => {
    if (selectedFile && playlistName.value && playlist) {
      const formData = new FormData();
      formData.append('playlistId', playlist._id);
      formData.append('picture', selectedFile);
      formData.append('name', playlistName.value);
      PlaylistService.changePlaylist(formData).then(() => {
        fetchPlaylist();
      });
    } else {
      alert('Введены не все данные о плейлисте');
    }
  };

  const handleDeletePlaylist = async () => {
    PlaylistService.deletePlaylist(playlist?._id).then(() => {
      navigate(`/playlists`);
    });
  };

  return (
    <ScrollArea className='flex-grow'>
      <div className='ml-10 mr-4'>
        <div className='flex w-full flex-row gap-6 my-10 h-64'>
          <img
            className=' border-solid border-[1px] border-muted object-cover shadow-xl block aspect-square rounded-md'
            src={playlist?.picture ? `${BASE_URL}/${playlist.picture}` : ''}
            alt=''
          />
          <div className='h-full flex flex-col pt-14 gap-0.5'>
            <div className='flex items-end gap-4 justify-between'>
              <p className='text-3xl font-semibold'>{playlist?.name}</p>
              <Button
                onClick={handleDeletePlaylist}
                variant='destructive'
                size='icon'
              >
                <Trash size={18} />
              </Button>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className='w-fit mt-16' size='sm' variant='secondary'>
                  <Pencil className='mr-2 w-4' />
                  <span className='font-bold '>Изменить</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className='sm:max-w-[425px]'>
                <AlertDialogHeader>
                  <AlertDialogTitle>Изменение плейлиста</AlertDialogTitle>
                  <AlertDialogDescription>
                    Введите новые данные о плейлисте
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
                    <Label
                      htmlFor='picture'
                      className=' items-start text-right'
                    >
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
                    Изменить
                  </AlertDialogAction>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <PlaylistSongsHeader />

        <div className='flex flex-col gap-0.5 '>
          {playlist?.tracks && playlist.tracks.length > 0 ? (
            playlist.tracks.map((track) => (
              <PlaylistSong
                key={track._id}
                track={track}
                playlistId={playlistId}
                setDeleted={setDeleted}
                otherPlaylistTracks={playlist.tracks}
              />
            ))
          ) : (
            <p className='text-center mt-6 text-muted-foreground'>
              Треков пока что нет🙁
            </p>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default PlaylistPage;
