import { FC, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Avatar,
  Box,
  useTheme,
} from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { GetAllPostsResponse, PostLike } from '../types/post';
import { FormatDistanceRelative } from './DateComponents';
import { Favorite } from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import { useDoubleTap } from 'use-double-tap';
import axios from 'axios';

interface PostCardProps {
  post: GetAllPostsResponse;
  blur?: boolean;
}

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const PostCard: FC<PostCardProps> = ({ post, blur }) => {
  const theme = useTheme();

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [likes, setLikes] = useState<PostLike[]>(post.likes);

  async function toggleLike() {
    try {
      const response = await axios.post(
        `/v1/post/${post.id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // 201 = liked
      // 200 = unliked
      const liked = response.status === 201;

      // update the post in the list
      const _likes = liked
        ? [...likes, response.data as PostLike]
        : likes.filter((like) => like.user.id !== user?.id);
      setLikes(_likes);
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  }

  const bindDoubleTap = useDoubleTap((event) => {
    console.log('Double tap event:', event);
    toggleLike();
  });

  const renderMedia = () => {
    return post.media.map((media, index) => (
      <Box key={index}>
        {media.mime.includes('image') ? (
          <CardMedia
            component="img"
            height="200"
            className={`${blur ? 'blur-lg' : ''} min-h-80 w-full h-full object-cover`}
            image={media.url}
            alt={`Media ${index + 1} for post ${post.id}`}
          />
        ) : (
          <CardMedia
            component="video"
            height="200"
            className={`${blur ? 'blur-lg' : ''} min-h-80 w-full`}
            src={media.url}
            controls
          />
        )}
      </Box>
    ));
  };

  return (
    <Card
      {...bindDoubleTap}
      sx={{
        marginBottom: 3,
        borderRadius: 0,
        boxShadow: 3,
        overflow: 'hidden',
      }}
    >
      <CardContent
        sx={{
          position: 'relative',
          py: 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            position: 'absolute',
            top: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            p: 1,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        >
          <Avatar
            alt={post.user.username}
            src={post.user.profilePic?.url || ''}
            sx={{
              width: 24,
              height: 24,
              border: '1px solid white',
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                // shadow
                textShadow: '1px 1px 1px rgba(0, 0, 0, 0.5)',
              }}
            >
              {post.user.username}
            </Typography>
          </Box>
        </Box>

        {post.media && (
          <Box sx={{ mx: -3, position: 'relative' }}>
            {post.media.length > 1 ? (
              <Slider {...sliderSettings}>{renderMedia()}</Slider>
            ) : (
              renderMedia()
            )}

            {post.text && (
              // instagram-like box with text
              <Box
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  // for testing
                  // backgroundColor: 'red',
                  color: 'white',
                  position: 'absolute',
                  bottom: 0,
                  zIndex: 1,
                  left: 0,
                  right: 0,
                  px: 2,
                  py: 1,
                  maxHeight: 69,
                  overflow: 'auto',
                }}
              >
                <Typography variant="body2">{post.text}</Typography>
              </Box>
            )}
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            mb: -2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mt: 1,
            }}
          >
            <FormatDistanceRelative date={post.createdAt} addSuffix />
          </Typography>

          <Typography
            sx={{
              fontWeight: 'medium',
            }}
            onClick={toggleLike}
          >
            <Favorite
              style={{
                color: likes.some((like) => like.user.id === user?.id)
                  ? 'red'
                  : theme.palette.text.secondary,
                marginRight: theme.spacing(0.3),
                fontSize: '1.2rem',
              }}
            />
            {likes.length}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard;
