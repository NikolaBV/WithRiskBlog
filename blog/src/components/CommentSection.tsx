import { useState, useEffect } from 'react';
import agent, { type Comment } from '@lib/api';

interface CommentSectionProps {
  postSlug: string;
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [postSlug]);

  const loadComments = async () => {
    try {
      const data = await agent.Comments.list(postSlug);
      setComments(data);
      setError(null);
    } catch (error) {
      console.error('Failed to load comments:', error);
      // Don't show error if API is just not running (dev mode)
      setError(null);
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const comment = await agent.Comments.create({
        postSlug,
        content: newComment.trim(),
        authorName: authorName.trim() || 'Anonymous',
      });
      setComments((prev) => [comment, ...prev]);
      setNewComment('');
      // Keep the author name for next comment
    } catch (error) {
      console.error('Failed to post comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="comments-loading">
        <div className="loading-spinner"></div>
        <p>Loading comments...</p>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="comments-container">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Your name (optional)"
          disabled={isSubmitting}
          className="name-input"
        />
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          disabled={isSubmitting}
          className="comment-input"
        />
        <div className="form-footer">
          {error && <p className="error-message">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="submit-button"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="comment">
              <header className="comment-header">
                <div className="comment-author">
                  {comment.userImage ? (
                    <img
                      src={comment.userImage}
                      alt={comment.userName}
                      className="author-avatar"
                    />
                  ) : (
                    <div className="author-avatar placeholder">
                      {comment.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="author-name">{comment.userName}</span>
                </div>
                <time className="comment-date">{formatDate(comment.createdAt)}</time>
              </header>
              <p className="comment-content">{comment.content}</p>
            </article>
          ))
        )}
      </div>

      <style>{styles}</style>
    </div>
  );
}

const styles = `
  .comments-container {
    font-family: var(--font-sans, system-ui, sans-serif);
  }

  .comments-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem;
    color: var(--color-text-muted, #71717a);
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 2px solid var(--color-border, #27272a);
    border-top-color: var(--color-accent, #f97316);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .comment-form {
    margin-bottom: 2rem;
  }

  .name-input {
    width: 100%;
    padding: 0.75rem 1rem;
    margin-bottom: 0.75rem;
    background: var(--color-bg-secondary, #12121a);
    border: 1px solid var(--color-border, #27272a);
    border-radius: 8px;
    color: var(--color-text, #e4e4e7);
    font-size: 0.95rem;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  .name-input:focus {
    outline: none;
    border-color: var(--color-accent, #f97316);
  }

  .name-input::placeholder {
    color: var(--color-text-muted, #71717a);
  }

  .comment-input {
    width: 100%;
    padding: 1rem;
    background: var(--color-bg-secondary, #12121a);
    border: 1px solid var(--color-border, #27272a);
    border-radius: 8px;
    color: var(--color-text, #e4e4e7);
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    min-height: 100px;
    transition: border-color 0.2s;
  }

  .comment-input:focus {
    outline: none;
    border-color: var(--color-accent, #f97316);
  }

  .comment-input::placeholder {
    color: var(--color-text-muted, #71717a);
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
    margin-top: 0.75rem;
  }

  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
  }

  .submit-button {
    padding: 0.75rem 1.5rem;
    background: var(--color-accent, #f97316);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
  }

  .submit-button:hover:not(:disabled) {
    background: var(--color-accent-hover, #fb923c);
  }

  .submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .no-comments {
    text-align: center;
    padding: 3rem 2rem;
    background: var(--color-bg-secondary, #12121a);
    border-radius: 12px;
    border: 1px dashed var(--color-border, #27272a);
    color: var(--color-text-muted, #71717a);
  }

  .comment {
    padding: 1.5rem;
    background: var(--color-bg-secondary, #12121a);
    border: 1px solid var(--color-border, #27272a);
    border-radius: 12px;
  }

  .comment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .comment-author {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .author-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }

  .author-avatar.placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-accent, #f97316);
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .author-name {
    font-weight: 600;
    color: var(--color-text, #e4e4e7);
  }

  .comment-date {
    font-size: 0.8rem;
    color: var(--color-text-muted, #71717a);
  }

  .comment-content {
    color: var(--color-text, #e4e4e7);
    line-height: 1.6;
  }

  @media (max-width: 640px) {
    .comment-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
`;

