import { ITrack } from '@/types/track';
import axios from 'axios';
import { BASE_URL } from './constants';

export const TrackService = {
  async getTracksByArtistId(artistId: string | undefined): Promise<ITrack[]> {
    const response = await axios.get<ITrack[]>(
      `${BASE_URL}/tracks/artist/${artistId}`
    );
    return response.data;
  },

  async deleteTrack(trackId: string | undefined): Promise<void> {
    await axios.delete(`${BASE_URL}/tracks/${trackId}`);
  },

  async createTrack(formData: FormData): Promise<ITrack> {
    const response = await axios.post(`${BASE_URL}/tracks`, formData);
    return response.data;
  },

  async searchTracks(trackName?: string): Promise<ITrack[]> {
    const response = await axios.get(`${BASE_URL}/tracks/search`, {
      params: {
        query: trackName,
      },
    });
    return response.data;
  },

  async getTrackDetails(trackId: string | undefined): Promise<ITrack> {
    const response = await axios.get(`${BASE_URL}/tracks/details/${trackId}`);
    return response.data;
  },
};
