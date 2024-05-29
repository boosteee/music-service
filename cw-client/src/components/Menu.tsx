import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { ModeToggle } from '@/components/ModeToggle';

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
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useNavigate } from 'react-router-dom';
import { useInput } from '@/hooks/useInput';
import { LoginService } from '@/services/login.service';
import { ToastAction } from './ui/toast';
import { useToast } from './ui/use-toast';
import { Toaster } from './ui/toaster';

export function Menu() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const loggedUser = JSON.parse(localStorage.getItem('user') ?? '{}');
  if (!loggedUser) {
    navigate('/login');
  }
  const { user } = loggedUser;
  console.log('Hello', user);

  const logOut = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const username = useInput('');
  const password = useInput('');
  const newPassword = useInput('');

  const changeUser = async () => {
    try {
      const data = await LoginService.changeUser(
        user.email,
        username.value,
        password.value,
        newPassword.value
      );

      toast({
        title: 'Данные изменены',
        description: 'Изменения вступят в силу после повторного входа.',
        action: <ToastAction altText='Хорошо'>Хорошо</ToastAction>,
      });
      return data;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Неправильный пароль',
        description: 'Введите правильный пароль и повторите попытку',
      });
    }
  };

  return (
    <AlertDialog>
      <Toaster />
      <Dialog>
        <Menubar className='flex flex-row justify-between rounded-none py-6 border-b border-none px-4 '>
          <div className='flex flex-row'>
            <span className='select-none cursor-default font-bold px-3 text-lg'>
              Sonora
            </span>
          </div>
          <div className='flex flex-row gap-1'>
            <MenubarMenu>
              <MenubarTrigger className='px-2'>{user.username}</MenubarTrigger>
              <MenubarContent forceMount>
                <DialogTrigger asChild>
                  <MenubarItem>Изменить аккаунт</MenubarItem>
                </DialogTrigger>
                <AlertDialogTrigger asChild>
                  <MenubarItem>Выйти</MenubarItem>
                </AlertDialogTrigger>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <ModeToggle />
            </MenubarMenu>
          </div>
        </Menubar>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Выход из аккаунта</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите выйти из своего аккаунта?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                logOut();
              }}
            >
              Да, выйти
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        <DialogContent className='sm:max-w-[525px]'>
          <DialogHeader>
            <DialogTitle>Изменить профиль</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='username' className='text-right'>
                Никнейм
              </Label>
              <Input {...username} id='username' className='col-span-3' />
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='password' className='text-right'>
                Пароль
              </Label>
              <Input {...password} id='password' className='col-span-3'></Input>
            </div>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='newpassword' className='text-right'>
                Новый пароль
              </Label>
              <Input {...newPassword} id='newpassword' className='col-span-3' />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                changeUser();
              }}
              type='submit'
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AlertDialog>
  );
}
