import { isLocal, isProduction, isTest } from '../../../../common/functions/enviroment.function';

describe('isProduction', () => {
  describe('NODE_ENV 값이 production 일때', () => {
    it('true 를 반환한다', () => {
      process.env.NODE_ENV = 'production';
      expect(isProduction()).toBe(true);
    });
  });

  describe('NODE_ENV 값이 production이 아니면', () => {
    it('false 를 반환한다', () => {
      process.env.NODE_ENV = 'local';
      expect(isProduction()).toBe(false);
    });
  });
});

describe('isLocal', () => {
  describe('process.env.NODE_ENV 값이 local 일때', () => {
    it('true 를 반환한다', () => {
      process.env.NODE_ENV = 'local';
      expect(isLocal()).toBe(true);
    });
  });

  describe('process.env.NODE_ENV 값이 local이 아니면', () => {
    it('false 를 반환한다', () => {
      process.env.NODE_ENV = 'production';
      expect(isLocal()).toBe(false);
    });
  });
});

describe('isTest', () => {
  describe('process.env.NODE_ENV 값이 test이면', () => {
    it('true 를 반환한다', () => {
      process.env.NODE_ENV = 'test';
      expect(isTest()).toBe(true);
    });
  });

  describe('process.env.NODE_ENV 값이 test이 아니면', () => {
    it('false 를 반환한다', () => {
      process.env.NODE_ENV = 'production';
      expect(isTest()).toBe(false);
    });
  });
});
