import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: any): Promise<string> {
    const payload = {
      guid: user.guid,
      role: user.role,
      COMPANY_GUID: user.COMPANY_GUID,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return accessToken;
  }
}
