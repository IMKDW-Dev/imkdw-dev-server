import User from '../../../modules/user/domain/models/user.model';

interface Params {
  id?: string;
}

// eslint-disable-next-line import/prefer-default-export
export const createUser = (params: Params) => new User.builder().setId(params.id).build();
