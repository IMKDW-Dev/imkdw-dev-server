import { CannotReplyOnReplyCommentException } from '../../../../../../../common/exceptions/403';
import { createUser } from '../../../../../../user/__test__/fixtures/create-user.fixture';
import Comment from '../../../../domain/models/comment.model';
import { createComment } from '../../../fixtures/comment.fixture';

describe('Comment', () => {
  describe('이미 답글로 작성된 댓글에', () => {
    const user = createUser();
    const comment = createComment({ author: user });
    const hasReplyComment = createComment({ parentId: comment.getId(), author: user });
    describe('답글 작성이 가능한지 확인하면', () => {
      it('예외가 발생한다', () => {
        expect(() => hasReplyComment.checkReplyAvailable()).toThrow(CannotReplyOnReplyCommentException);
      });
    });
  });

  describe('일반 댓글에', () => {
    const comment = new Comment.builder().setContent('a'.repeat(10)).build();
    describe('답글 작성이 가능한지 확인하면', () => {
      it('예외가 발생하지 않는다', () => {
        expect(() => comment.checkReplyAvailable()).not.toThrow();
      });
    });
  });
});
