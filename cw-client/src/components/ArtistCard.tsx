import { IArtist } from '@/types/artist';
import { Button } from './ui/button';
import { BASE_URL } from '@/services/constants';

interface ArtistCardProps {
  artist: IArtist;
  onClick?: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onClick }) => {
  return (
    <div
      onClick={onClick}
      className='group cursor-pointer rounded-lg w-52 flex items-center flex-col gap-1'
    >
      <img
        src={`${BASE_URL}/${artist.picture}`}
        className=' border-solid border-border border rounded-full transition-all group-hover:brightness-75 aspect-square object-cover'
        alt=''
      />
      <div className='font-semibold text-sm flex flex-col'>
        <Button className='w-fit h-fit p-0 m-0' variant='link'>
          <p>{artist.name}</p>
        </Button>
      </div>
    </div>
  );
};

export default ArtistCard;
