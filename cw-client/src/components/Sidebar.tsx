import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Library, ListMusic, Mic2, Search, Star } from 'lucide-react';
import { useContext, useMemo, useState } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import { PlaylistService } from '@/services/playlist.service';
import { IPlaylist } from '@/types/playlist';
import PlaylistPage from '../pages/PlaylistPage';
import { Separator } from './ui/separator';

export function Sidebar({}) {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user') ?? '{}');
  const { user } = userData;

  return (
    <div className='flex h-[calc(100vh-8rem)] border-r-[1.5px] border-solid border-border'>
      <div className={cn('pb-12 max-w-[18rem] ')}>
        <div className='space-y-4 py-4'>
          <div className='px-3 py-2'>
            <div className='space-y-1'>
              <Button
                onClick={() => {
                  navigate('/search');
                }}
                variant='ghost'
                className='w-full justify-start'
              >
                <Search className='w-4 h-4 mr-2' />
                Поиск
              </Button>
            </div>
          </div>
          <div className='px-3 py-2'>
            <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>
              Библиотека
            </h2>
            <div className='space-y-1'>
              <Button
                onClick={() => {
                  navigate('/artists');
                }}
                variant='ghost'
                className='w-full justify-start'
              >
                <Mic2 className='w-4 h-4 mr-2' />
                Исполнители
              </Button>
              <Button
                onClick={() => {
                  navigate('/albums');
                }}
                variant='ghost'
                className='w-full justify-start'
              >
                <Library className='w-4 h-4 mr-2' /> Альбомы
              </Button>
              <Button
                onClick={() => {
                  navigate('/playlists');
                }}
                variant='ghost'
                className='w-full justify-start'
              >
                <ListMusic className='w-4 h-4 mr-2' />
                Плейлисты
              </Button>
            </div>
          </div>
          {user.role === 2 ? (
            <div className='px-3 py-2'>
              <h2 className='mb-2 px-4 text-lg font-semibold tracking-tight'>
                Панель администратора
              </h2>
              <Button
                onClick={() => {
                  navigate('/admin/artists');
                }}
                variant='ghost'
                className='w-full justify-start'
              >
                <Star className='w-4 h-4 mr-2' />
                Исполнители
              </Button>
              <Button
                onClick={() => {
                  navigate('/admin/albums');
                }}
                variant='ghost'
                className='w-full justify-start'
              >
                <Star className='w-4 h-4 mr-2' />
                Альбомы
              </Button>
              <Button
                onClick={() => {
                  navigate('/admin/tracks');
                }}
                variant='ghost'
                className='w-full justify-start'
              >
                <Star className='w-4 h-4 mr-2' />
                Треки
              </Button>
              <Button
                onClick={() => {
                  navigate('/admin/users');
                }}
                variant='ghost'
                className='w-full justify-start'
              >
                <Star className='w-4 h-4 mr-2' />
                Пользователи
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
