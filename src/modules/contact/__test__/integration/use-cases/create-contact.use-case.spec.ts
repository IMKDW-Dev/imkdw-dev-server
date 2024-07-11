import { Test } from '@nestjs/testing';
import CreateContactUseCase from '../../../use-cases/create-contact.use-case';
import { CONTACT_REPOTIROY } from '../../../repository/contact-repo.interface';
import ContactRepository from '../../../infra/contact.repository';
import { createCreateContactDto } from '../../fixtures/contact-dto.fixture';
import PrismaService from '../../../../../infra/database/prisma.service';
import { cleanupDatabase } from '../../../../../../prisma/__test__/utils/cleanup';
import createClsModule from '../../../../../common/modules/cls.module';

describe('CreateContactUseCase', () => {
  let sut: CreateContactUseCase;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [createClsModule()],
      providers: [
        CreateContactUseCase,
        {
          provide: CONTACT_REPOTIROY,
          useClass: ContactRepository,
        },
      ],
    }).compile();

    sut = module.get<CreateContactUseCase>(CreateContactUseCase);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await cleanupDatabase(prisma);
  });

  describe('작성할 문의자 정보가 주어지고', () => {
    const dto = createCreateContactDto();
    describe('문의를 작성하면', () => {
      it('문의내용을 반환한다', async () => {
        const result = await sut.execute(dto);
        expect(result.getName()).toBe(dto.name);
        expect(result.getEmail()).toBe(dto.email);
        expect(result.getSubject()).toBe(dto.subject);
        expect(result.getMessage()).toBe(dto.message);
      });
    });
  });
});
