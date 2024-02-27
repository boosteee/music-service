import { IPlaylist } from '@/types/playlist';
import { Button } from './ui/button';
import { BASE_URL } from '@/services/constants';

interface PlaylistCardProps {
  playlist: IPlaylist;
  onClick?: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onClick }) => {
  return (
    <div
      onClick={onClick}
      className='group cursor-pointer rounded-lg w-52 flex flex-col gap-1'
    >
      <img
        src={`${BASE_URL}/${playlist.picture}`}
        className='transition-all group-hover:brightness-75 rounded-lg aspect-square object-cover'
      />
      <div className='font-semibold text-sm flex flex-col'>
        <Button variant='link' className='w-fit h-fit p-0 mt-0.5'>
          <p>{playlist.name}</p>
        </Button>
      </div>
    </div>
  );
};

export default PlaylistCard;
