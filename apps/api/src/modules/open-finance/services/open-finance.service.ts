import { Injectable } from '@nestjs/common';
import { CONNECT_BENEFITS, INSTITUTIONS } from '../catalog';
import type { ConnectBenefitDto, InstitutionDto } from '../dto/open-finance.dto';

@Injectable()
export class OpenFinanceService {
  benefits(): ConnectBenefitDto[] {
    return CONNECT_BENEFITS;
  }

  institutions(query?: string): InstitutionDto[] {
    const q = query?.trim().toLowerCase();
    if (!q) {
      return INSTITUTIONS;
    }
    return INSTITUTIONS.filter((item) => item.name.toLowerCase().includes(q));
  }
}
