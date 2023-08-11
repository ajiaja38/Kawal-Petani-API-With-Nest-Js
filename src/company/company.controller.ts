import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async postCompanyHandler(@Body() payload: CreateCompanyDto): Promise<object> {
    const COMPANY_GUID = await this.companyService.createCompany(payload);
    return {
      status: 'success',
      message: `Berhasil membuat company ${COMPANY_GUID}`,
    };
  }

  @Get()
  async getAllCompaniesHandler(): Promise<object> {
    const companies = await this.companyService.getAllCompany();

    return {
      status: 'success',
      data: companies,
    };
  }

  @Get('/:guid')
  async getCompanyByGuidHandler(@Param('guid') guid: string): Promise<object> {
    const company = await this.companyService.getCompanyByGuid(guid);

    return {
      status: 'success',
      data: company,
    };
  }

  @Put('/:guid')
  async updateCompanyByGUidHandler(
    @Param('guid') guid: string,
    @Body() payload: UpdateCompanyDto,
  ): Promise<object> {
    const companyGuid = await this.companyService.updateCompanyByGuid(
      guid,
      payload,
    );

    return {
      status: 'success',
      message: `Berhasil update company ${companyGuid}`,
    };
  }

  @Delete('/:guid')
  async deleteCompanyByGuidHandler(
    @Param('guid') guid: string,
  ): Promise<object> {
    await this.companyService.deleteCompanyByGuid(guid);

    return {
      status: 'success',
      message: 'Berhasil Hapus Company',
    };
  }
}
