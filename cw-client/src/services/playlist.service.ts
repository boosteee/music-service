import { IPlaylist } from '@/types/playlist';
import axios from 'axios';
import { BASE_URL } from './constants';

export const PlaylistService = {
  async getPlaylistByUserEmail(data: string): Promise<IPlaylist[]> {
    const response = await axios.get<IPlaylist[]>(
      `${BASE_URL}/playlists/email/${data}`
    );
    return response.data;
  },

  async createPlaylist(formData: FormData): Promise<IPlaylist> {
    const response = await axios.post(`${BASE_URL}/playlists`, formData);
    return response.data;
  },

  async getPlaylistDetails(playlistId: string | undefined): Promise<IPlaylist> {
    const response = await axios.get<IPlaylist>(
      `${BASE_URL}/playlists/details/${playlistId}`
    );
    return response.data;
  },

  async changePlaylist(formData: FormData): Promise<IPlaylist> {
    const response = await axios.patch<IPlaylist>(
      `${BASE_URL}/playlists/details`,
      formData
    );
    return response.data;
  },

  async addTrackToPlaylist(
    playlistId: string,
    trackId: string
  ): Promise<IPlaylist> {
    const response = await axios.patch<IPlaylist>(
      `${BASE_URL}/playlists/${playlistId}/track/${trackId}`
    );
    return response.data;
  },

  async deleteTrackFromPlaylist(
    playlistId: string | undefined,
    trackId: string
  ): Promise<IPlaylist> {
    const response = await axios.delete<IPlaylist>(
      `${BASE_URL}/playlists/${playlistId}/track/${trackId}`
    );
    return response.data;
  },

  async deletePlaylist(playlistId: string | undefined): Promise<void> {
    await axios.delete(`${BASE_URL}/playlists/${playlistId}`);
  },
};
