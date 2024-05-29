import * as React from 'react';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { LoginService } from '@/services/login.service';
import { IUserRegisterData } from '@/types/user';
import { useInput } from '@/hooks/useInput';
import { useToast } from './ui/use-toast';
import { useEffect, useState } from 'react';

const RegisterForm = ({
  setToggle,
}: {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const username = useInput('');
  const email = useInput('');
  const password = useInput('');
  const confirmPassword = useInput('');

  const handleRegister = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();

      if (password.value !== confirmPassword.value) {
        toast({
          variant: 'destructive',
          title: 'Ошибка регистрации',
          description: 'Введенные Вами пароли не совпадают',
        });
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        toast({
          variant: 'destructive',
          title: 'Ошибка регистрации',
          description:
            'Введенный адрес электронной почты имеет неверный формат',
        });
        return;
      }
      const user: IUserRegisterData = {
        email: email.value,
        password: password.value,
        username: username.value,
        isBlocked: false,
      };
      await LoginService.register(user);
      setToggle(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка регистрации',
        description: 'Пользователь с такой почтой существует',
      });
      return;
    }
  };

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (
      username.value &&
      password.value &&
      confirmPassword.value &&
      email.value
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [username.value, password.value, email.value, confirmPassword.value]);

  return (
    <>
      <div className={cn('grid space-y-8')}>
        <div className='flex flex-col space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>Регистрация</h1>
          <p className='text-sm text-muted-foreground'>
            Введите данные, чтобы зарегистрироваться
          </p>
        </div>
        <div className='flex flex-col gap-2 items-center '>
          <form className='w-full'>
            <div className='grid gap-6'>
              <div className='grid gap-2'>
                <Input
                  {...username}
                  id='username'
                  placeholder='Имя пользователя'
                />
                <Input
                  {...email}
                  id='email'
                  placeholder='Email'
                  type='email'
                  autoCapitalize='on'
                  autoComplete='email'
                  autoCorrect='on'
                />
                <Input
                  {...password}
                  id='password'
                  placeholder='Пароль'
                  type='password'
                />
                <Input
                  {...confirmPassword}
                  id='confirmpassword'
                  placeholder='Повторите пароль'
                  type='password'
                />
              </div>
              <Button disabled={disabled} onClick={handleRegister}>
                Зарегистрироваться
              </Button>
            </div>
          </form>
          <p className='text-sm gap-1 text-muted-foreground w-full justify-center items-center flex'>
            Уже есть аккаунт?{' '}
            <Button
              className='p-0 m-0 h-fit w-fit'
              onClick={() => setToggle(false)}
              variant='link'
            >
              Войти
            </Button>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
