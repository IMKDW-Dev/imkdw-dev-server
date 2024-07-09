import { CannotReplyOnReplyCommentException } from '../../../../../../../common/exceptions/403';
import Comment from '../../../../../comment/domain/models/comment.model';

describe('Comment', () => {
  describe('이미 답글로 작성된 댓글에', () => {
    const comment = new Comment.builder().setContent('a'.repeat(10)).build();
    const hasReplyComment = new Comment.builder().setContent('a'.repeat(10)).setParent(comment).build();
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
