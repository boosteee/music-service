import { IAlbum } from '@/types/album';
import { IGenre } from '@/types/genre';
import { BASE_URL } from './constants';
import axios from 'axios';

export const AlbumService = {
  async createAlbum(formData: FormData): Promise<IAlbum> {
    const response = await axios.post(`${BASE_URL}/albums`, formData);
    return response.data;
  },

  async deleteAlbum(albumId: string | undefined): Promise<void> {
    await axios.delete(`${BASE_URL}/albums/${albumId}`);
  },

  async getGenresWithAlbums(): Promise<IGenre[]> {
    const response = await axios.get<IGenre[]>(`${BASE_URL}/albums/genre`);
    return response.data;
  },

  async getAllAlbums(): Promise<IAlbum[]> {
    const response = await axios.get<IAlbum[]>(`${BASE_URL}/albums`);
    return response.data;
  },

  async getAlbumById(albumId: string | undefined): Promise<IAlbum> {
    const response = await axios.get<IAlbum>(
      `${BASE_URL}/albums/get/${albumId}`
    );
    return response.data;
  },

  async searchAlbums(
    albumName?: string,
    genreName?: string
  ): Promise<IAlbum[]> {
    const response = await axios.get(`${BASE_URL}/albums/search`, {
      params: {
        query: albumName,
        genreQuery: genreName,
      },
    });
    return response.data;
  },

  async addGenre(genreName: string): Promise<IGenre> {
    const response = await axios.post<IGenre>(
      `${BASE_URL}/albums/genre/${genreName}`
    );
    return response.data;
  },
};
