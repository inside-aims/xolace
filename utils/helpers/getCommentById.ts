
// Helper function to find a comment by ID in a nested structure
export const findCommentById = (comments: any[], id: number): any | undefined => {
  for (const comment of comments) {
    if (comment.id === id) {
      return comment;
    }
    if (comment.replies && comment.replies.length > 0) {
      const found = findCommentById(comment.replies, id);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
};