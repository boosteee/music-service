import React from 'react';
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
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useInput } from '@/hooks/useInput';
import { AlbumService } from '@/services/album.service';

export interface AddGenreFormProps {
  setCreated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddGenreForm: React.FC<AddGenreFormProps> = ({ setCreated }) => {
  const genreName = useInput('');

  const addGenreHandle = async () => {
    const data = await AlbumService.addGenre(genreName.value);
    setCreated(true);
    return data;
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='outline'>Добавить жанр</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Добавление жанра</AlertDialogTitle>
          <AlertDialogDescription>
            Введите название жанра
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className=' grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='name' className='text-right'>
            Название
          </Label>
          <Input {...genreName} id='name' className='col-span-3' />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              addGenreHandle();
            }}
          >
            Добавить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddGenreForm;
