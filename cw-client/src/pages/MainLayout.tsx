import { Menu } from '@/components/Menu';
import { Separator } from '@/components/ui/separator';
import { Sidebar } from '@/components/Sidebar';
import Player from '@/components/SongControl/Player';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <div className=' pb-36 flex flex-col w-screen h-screen'>
        <Menu />
        <Separator />
        <div className='flex max-h-full max-w-full'>
          <Sidebar />
          <Outlet />
        </div>
      </div>

      <Player />
    </>
  );
};

export default MainLayout;
