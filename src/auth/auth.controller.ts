import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post('/login')
  async postLoginHandler(@Body() payload: LoginDto): Promise<object> {
    const user = await this.userService.verifyUsersCredentials(payload);
    const accessToken = await this.authService.login(user);
    return {
      status: 'success',
      accessToken,
    };
  }
}
