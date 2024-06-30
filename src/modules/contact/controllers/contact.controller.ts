import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ContactService from '../services/contact.service';
import * as Swagger from '../docs/contact.swagger';
import RequestCreateContactDto from '../dto/request/create-contact.dto';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('[문의] 공통')
@Controller({ path: 'contacts', version: '1' })
export default class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Swagger.createContact('문의 생성')
  @Public()
  @Post()
  async createContact(@Body() dto: RequestCreateContactDto) {
    await this.contactService.createContact(dto);
  }
}
