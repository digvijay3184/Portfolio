import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('dashboard/summary')
  async getSummary() {
    return this.dashboardService.getSummary();
  }

  @Get('messages')
  async getMessages(@Query('limit') limit: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 5;
    return this.dashboardService.getRecentMessages(parsedLimit);
  }
}
