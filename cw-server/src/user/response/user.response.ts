import { Playlist } from 'src/playlist/schemas/playlist.schema';
import { Roles } from '../schemas/user.schema';
import { Artist } from 'src/artist/schemas/artist.schema';

export class UserResponse {
  email: string;
  role: Roles;
  username: string;
  playlists: Playlist[];
  subscriptions: Artist[];
}
