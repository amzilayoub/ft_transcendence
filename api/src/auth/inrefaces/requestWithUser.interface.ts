import { Request } from 'express';
import { FortyTwoUserDto } from '../dto/auth.dto';
interface RequestWithUser extends Request {
    user: FortyTwoUserDto;
}
export default RequestWithUser;
