import { Request } from 'express';

import { UserResponse } from 'src/user/response/user.response';

export default interface RequestWithUser extends Request {
  user: UserResponse;
}
