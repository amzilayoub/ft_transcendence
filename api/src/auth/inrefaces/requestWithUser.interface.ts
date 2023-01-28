import { Request } from 'express';
import { UserDto } from 'src/users/dto/user.dto';

interface RequestWithUser extends Request {
    user: UserDto;
}

export default RequestWithUser;
