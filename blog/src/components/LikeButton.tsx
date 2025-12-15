import { useState, useEffect } from 'react';
import agent from '@lib/api';

interface LikeButtonProps {
  postSlug: string;
}

export default function LikeButton({ postSlug }: LikeButtonProps) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [postSlug]);

  const loadStats = async () => {
    try {
      const stats = await agent.Posts.getStats(postSlug);
      setLikes(stats.likes);
      setIsLiked(stats.isLikedByUser);
    } catch (error) {
      // API not running - that's ok in dev mode
      console.log('API not available for stats');
      setLikes(0);
      setIsLiked(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await agent.Posts.unlike(postSlug);
        setLikes((prev) => prev - 1);
        setIsLiked(false);
      } else {
        await agent.Posts.like(postSlug);
        setLikes((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  if (isLoading) {
    return (
      <button className="like-button loading" disabled>
        <span className="like-icon">♡</span>
        <span>...</span>
      </button>
    );
  }

  return (
    <>
      <button
        className={`like-button ${isLiked ? 'liked' : ''}`}
        onClick={handleLike}
        aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
      >
        <span className="like-icon">{isLiked ? '♥' : '♡'}</span>
        <span className="like-count">{likes}</span>
      </button>

      <style>{`
        .like-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--color-bg-secondary, #12121a);
          border: 1px solid var(--color-border, #27272a);
          border-radius: 8px;
          color: var(--color-text-muted, #71717a);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .like-button:hover {
          border-color: #ef4444;
          color: #ef4444;
        }

        .like-button.liked {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
          color: #ef4444;
        }

        .like-button.loading {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .like-icon {
          font-size: 1.1rem;
          transition: transform 0.2s ease;
        }

        .like-button:hover .like-icon {
          transform: scale(1.15);
        }

        .like-button.liked .like-icon {
          animation: heartBeat 0.3s ease-in-out;
        }

        @keyframes heartBeat {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}

