import { UserResponse } from '../../user/response/user.response';

export class LoginResponse {
  accessToken: string;
  user: UserResponse;
}
