import {
  IUser,
  IUserAuth,
  IUserLoginData,
  IUserRegisterData,
} from '@/types/user';
import { IArtist } from '@/types/artist';
import axios from 'axios';
import { BASE_URL } from './constants';

export const LoginService = {
  async login(data: IUserLoginData): Promise<IUserAuth> {
    const response = await axios.post<IUserAuth>(
      `${BASE_URL}/auth/login`,
      data
    );
    return response.data;
  },

  async register(data: IUserRegisterData): Promise<void> {
    await axios.post<IUserAuth>(`${BASE_URL}/auth/register`, data);
  },

  async getUserByEmail(data: string): Promise<IUser> {
    const response = await axios.get<IUser>(`${BASE_URL}/users/email/${data}`);
    return response.data;
  },

  async searchUsers(userName?: string): Promise<IUser[]> {
    const users = await axios.get(`${BASE_URL}/users`, {
      params: {
        query: userName,
      },
    });
    return users.data;
  },

  async blockUser(userId: string): Promise<IUser> {
    const user = await axios.patch<IUser>(`${BASE_URL}/users/block/${userId}`);
    return user.data;
  },

  async changeUser(
    email: string,
    username: string,
    password: string,
    newPassword: string
  ) {
    const user = await axios.patch<IUser>(
      `${BASE_URL}/users/change/${email}/${username}/${password}/${newPassword}`
    );
    return user;
  },

  async getSubs(email: string): Promise<IArtist[]> {
    const response = await axios.get<IArtist[]>(
      `${BASE_URL}/artists/subs/${email}`
    );
    return response.data;
  },

  async subscribe(artistId: string | undefined, email: string): Promise<void> {
    await axios.post(`${BASE_URL}/artists/${artistId}/sub/${email}`);
  },

  async unsubscribe(
    artistId: string | undefined,
    email: string
  ): Promise<void> {
    await axios.delete(`${BASE_URL}/artists/${artistId}/sub/${email}`);
  },
};
