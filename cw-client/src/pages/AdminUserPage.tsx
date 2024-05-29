import { ShieldCheck, ShieldX } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useEffect, useState } from 'react';
import { IUser } from '@/types/user';
import { LoginService } from '@/services/login.service';

const AdminUserPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getUser = async () => {
    try {
      const data = await LoginService.searchUsers(searchQuery);
      setUsers(data);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  const handleBlockUser = async (userId: string) => {
    await LoginService.blockUser(userId).then(() => {
      getUser();
    });
  };

  useEffect(() => {
    getUser();
  }, [searchQuery]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <ScrollArea className='mb-16 flex-grow'>
      <div className='flex-col items-center'>
        <div className='items-end  flex justify-between pl-10 py-4 pr-8 text-4xl font-semibold '>
          <div>Управление пользователями</div>
          <div className='flex flex-row gap-3 items-end'>
            <Input
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder='Найти пользователя...'
              className='w-48'
              type='text'
            />
          </div>
        </div>
        <div className='px-10 mt-6 flex justify-center'>
          <Table className=''>
            <TableCaption>Список всех пользователей</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='w-1/3'>Имя</TableHead>
                <TableHead className='w-1/3'>Email</TableHead>
                <TableHead className='text-right'>
                  Количество плейлистов
                </TableHead>
                <TableHead className='w-20 text-right'>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className='text-right'>
                    {user.playlists.length}
                  </TableCell>
                  <TableCell className=' w-20 text-right'>
                    <Button
                      onClick={() => {
                        handleBlockUser(user._id);
                      }}
                      variant='destructive'
                      className={
                        !user.isBlocked ? 'bg-green-500 hover:bg-green-400' : ''
                      }
                      size='icon'
                    >
                      {user.isBlocked === true ? (
                        <ShieldX width={18} /> // Change the icon based on state
                      ) : (
                        <ShieldCheck width={18} />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScrollArea>
  );
};

export default AdminUserPage;
