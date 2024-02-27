import { IAlbum } from '@/types/album';
import { Button } from './ui/button';
import { BASE_URL } from '@/services/constants';

interface AlbumCardProps {
  album: IAlbum;
  onClick?: () => void;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick }) => {
  return (
    <div
      className='group cursor-pointer rounded-lg w-52 flex flex-col gap-1'
      onClick={onClick}
    >
      <img
        src={`${BASE_URL}/${album.picture}`}
        className='transition-all group-hover:brightness-75 rounded-lg aspect-square object-cover'
        alt=''
      />
      <div className='font-semibold text-sm flex flex-col'>
        <p className=' truncate'>{album.name}</p>
        <Button className='w-fit h-fit p-0 m-0' variant='link'>
          <p className='text-muted-foreground'>{album.artist.name}</p>
        </Button>
      </div>
    </div>
  );
};

export default AlbumCard;
