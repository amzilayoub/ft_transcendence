// import { Injectable } from "@nestjs/common";
// import { PassportStrategy } from "@nestjs/passport";
// import { Strategy } from "passport-local";
// import { AuthService } from "../auth.service";

// @Injectable()
// export class localStrategy extends PassportStrategy(Strategy) {
//     constructor(private readonly authService: AuthService) {
//         super({
//             usernameField: "email",
//             passwordField: "password",
//         });
//     }
//     async validate(username: string, password: string) {
//         return await this.authService.getByEmail({ email: username, password });
//     }
// }