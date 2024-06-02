import { PickType } from '@nestjs/swagger';
import ContactDto from '../contact.dto';

export default class RequestCreateContactDto extends PickType(ContactDto, ['name', 'email', 'subject', 'message']) {}
