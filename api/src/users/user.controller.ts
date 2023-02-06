import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import JwtGuard from 'src/common/guards/jwt_guard';
import RequestWithUser from 'src/auth/inrefaces/requestWithUser.interface';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('me')
    async getMe(@Req() request: RequestWithUser) {
        const { id } = request.user;
        const user = await this.userService.findOneById(id);
        return user;
    }

    @Get('stats/top-players')
    async getTopUsers() {
        const users = await this.userService.getTopUsers();
        return users;
    }

    @Get(':username')
    async getUser(@Req() req) {
        const { username } = req.params;
        const user = await this.userService.findOne(username);
        return user;
        // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    @Get('search/:query')
    async searchUser(@Req() req) {
        const { query } = req.params;
        const users = await this.userService.searchByUsername(query);
        return users;
    }

    /*
     ** Friend means following or follower or both
     */
    @Get('friends/:username')
    async getFollowings(@Req() req) {
        const { username } = req.params;
        const followings = await this.userService.searchFriendsByUsername(
            username,
        );
        return followings;
    }

    @Get(':username/friends')
    async getFriends(@Req() req) {
        const { username } = req.params;
        const friends = await this.userService.getFriends(username);
        return friends;
    }

    @Get('followers/:username')
    async getFollowers(@Req() req) {
        const { username } = req.params;
        const followers = await this.userService.getFollowers(username);
        return followers;
    }

    @Get('following/:username')
    async getFollowing(@Req() req) {
        const { username } = req.params;
        const following = await this.userService.getFollowing(username);
        return following;
    }

    @Get('follow/:username')
    async followUser(@Req() req) {
        const { username } = req.params;
        const { id } = req.user;
        const follow = await this.userService.followUser(id, username);
        return follow;
    }

    @Get('unfollow/:username')
    async unfollowUser(@Req() req) {
        const { username } = req.params;
        const { id } = req.user;
        const unfollow = await this.userService.unfollowUser(id, username);
        return unfollow;
    }

    // checks if user follows another user
    @Get('is-following/:username')
    async followsUser(@Req() req, @Res() res) {
        const { username } = req.params;
        const { id } = req.user;
        const follows = await this.userService.isfollowingsUser(id, username);
        if (follows) {
            return res.status(200).send();
        }
        return res.status(404).send();
    }

    @Post('update')
    async updateUser(@Req() req) {
        const { id } = req.user;
        const { nickname, bio, first_name, last_name, avatar_url, cover_url } =
            req.body;
        const user = await this.userService.update(id, {
            nickname,
            first_name,
            last_name,
            bio,
            avatar_url,
            cover_url,
        });
        return user;
    }

    

    
}
