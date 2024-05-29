import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { LoginService } from '@/services/login.service';
import { IUserLoginData } from '@/types/user';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useInput } from '@/hooks/useInput';
import { useToast } from './ui/use-toast';
import { Toaster } from './ui/toaster';

export function AuthForm({
  setToggle,
}: {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  if (!authContext) {
    return;
  }
  const { setUserData } = authContext;

  const email = useInput('');
  const password = useInput('');

  const handleLogin = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const user: IUserLoginData = {
      email: email.value,
      password: password.value,
    };

    try {
      const data = await LoginService.login(user);
      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
      }
      setUserData(data);

      navigate('/playlists');
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        toast({
          variant: 'destructive',
          title: 'Ошибка входа',
          description: 'Неверные данные для авторизации',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Ошибка входа',
          description:
            'Неверные данные для авторизации/ Вам заблокировали доступ к сервису',
        });
      }
    }
  };

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (password.value && email.value) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [password.value, email.value]);

  return (
    <div className={cn('grid space-y-8')}>
      <Toaster />
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          Войти в аккаунт
        </h1>
        <p className='text-sm text-muted-foreground'>
          Введите вашу почту и пароль, чтобы войти аккаунт
        </p>
      </div>
      <div className='flex flex-col gap-2 items-center '>
        <form className='w-full'>
          <div className='grid gap-6'>
            <div className='grid gap-2'>
              <Input
                {...email}
                id='email'
                placeholder='Email'
                type='email'
                autoCapitalize='none'
                autoComplete='email'
                autoCorrect='off'
              />
              <Input
                {...password}
                id='password'
                placeholder='Пароль'
                type='password'
              />
            </div>
            <Button disabled={disabled} onClick={handleLogin}>
              Войти
            </Button>
          </div>
        </form>
        <p className='text-sm gap-1 text-muted-foreground w-full justify-center items-center flex'>
          Нет аккаунта?{' '}
          <Button
            onClick={() => setToggle(true)}
            className='p-0 m-0 h-fit w-fit'
            variant='link'
          >
            Зарегистрироваться
          </Button>
        </p>
      </div>
    </div>
  );
}
