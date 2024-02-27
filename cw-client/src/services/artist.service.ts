import { IArtist } from '@/types/artist';
import axios from 'axios';
import { BASE_URL } from './constants';

export const ArtistService = {
  async addArtist(formData: FormData): Promise<IArtist> {
    const response = await axios.post(`${BASE_URL}/artists`, formData);
    return response.data;
  },

  async deleteArtist(artistId: string | undefined): Promise<void> {
    await axios.delete(`${BASE_URL}/artists/${artistId}`);
  },

  async getAllArtist(): Promise<IArtist[]> {
    const response = await axios.get<IArtist[]>(`${BASE_URL}/artists`);
    return response.data;
  },

  async getArtistById(artistId: string | undefined): Promise<IArtist> {
    const response = await axios.get<IArtist>(
      `${BASE_URL}/artists/${artistId}`
    );
    return response.data;
  },

  async searchArtists(artistName?: string): Promise<IArtist[]> {
    const response = await axios.get(`${BASE_URL}/artists/search`, {
      params: {
        query: artistName,
      },
    });
    return response.data;
  },

  async getArtistWithALbums(artistId: string | undefined): Promise<IArtist> {
    const response = await axios.get<IArtist>(
      `${BASE_URL}/artists/get/${artistId}`
    );
    return response.data;
  },
};
