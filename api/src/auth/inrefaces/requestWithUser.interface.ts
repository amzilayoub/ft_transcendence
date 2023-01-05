
import { Request } from 'express';
import { UserDto } from '../dto/auth.dto';
interface RequestWithUser extends Request {
  user: UserDto;
}
 
export default RequestWithUser;