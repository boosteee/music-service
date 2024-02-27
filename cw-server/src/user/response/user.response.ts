import { Playlist } from 'src/playlist/schemas/playlist.schema';
import { Roles } from '../schemas/user.schema';

export class UserResponse {
  email: string;
  role: Roles;
  username: string;
  playlists: Playlist[];
}
