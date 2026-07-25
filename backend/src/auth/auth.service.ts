import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AdminUser } from '../schemas/admin-user.schema';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(AdminUser.name) private adminUserModel: Model<AdminUser>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    const adminCount = await this.adminUserModel.countDocuments();
    if (adminCount === 0) {
      const email = this.configService.get<string>('ADMIN_EMAIL', 'admin@portfolio.local');
      const password = this.configService.get<string>('ADMIN_PASSWORD', 'adminpassword');
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      await this.adminUserModel.create({
        email,
        passwordHash,
        role: 'owner',
      });
      console.log(`Seeded initial admin user: ${email}`);
    }
  }

  async login(email: string, pass: string) {
    const user = await this.adminUserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    user.lastLoginAt = new Date();
    await user.save();

    return tokens;
  }

  async refreshTokens(refreshToken: string) {
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'secret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userId = payload.sub;
    const user = await this.adminUserModel.findById(userId);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access Denied');
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isMatch) {
      throw new UnauthorizedException('Access Denied');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    await this.adminUserModel.findByIdAndUpdate(userId, { refreshTokenHash: null });
  }

  private async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_SECRET', 'secret'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION', '15m') as any,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'secret'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d') as any,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const salt = await bcrypt.genSalt(10);
    const refreshTokenHash = await bcrypt.hash(refreshToken, salt);
    await this.adminUserModel.findByIdAndUpdate(userId, { refreshTokenHash });
  }
}
