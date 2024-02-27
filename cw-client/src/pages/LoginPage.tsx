import { AuthForm } from '../components/AuthForm';
import RegisterForm from '../components/RegisterForm';
import { ModeToggle } from '@/components/ModeToggle';
import lightBackground from '@/assets/light.jpg';
import darkBackground from '@/assets/dark.jpg';
import { useState } from 'react';
import { Toaster } from '../components/ui/toaster';

export default function LoginPage() {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <>
      <Toaster />
      <div className='container grid relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='absolute right-4 top-4 md:right-8 md:top-10'>
          <ModeToggle />
        </div>
        <div className='relative hidden h-full flex-col bg-muted p-10 lg:flex'>
          <img
            className='dark:block hidden w-full h-full absolute object-cover inset-0'
            src={darkBackground}
          />
          <img
            className='block dark:hidden w-full h-full absolute object-cover inset-0'
            src={lightBackground}
          />
          <div className='relative z-20 gap-2 flex items-center text-lg font-medium'>
            <p className='font-bold text-2xl'>Sonora</p>
          </div>
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center sm:w-[350px]'>
            {!toggle ? (
              <AuthForm setToggle={setToggle} />
            ) : (
              <RegisterForm setToggle={setToggle} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
