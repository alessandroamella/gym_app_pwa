import { FC } from 'react';
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
import { GetAllPostsResponse } from '../types/post';
import { FormatDistanceRelative } from './DateComponents';
import { Favorite } from '@mui/icons-material';
import ProtectedMedia from './ProtectedMedia';

interface PostCardProps {
  post: GetAllPostsResponse;
}

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
};

const PostCard: FC<PostCardProps> = ({ post }) => {
  const theme = useTheme();

  return (
    <Card
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
            top: 10,
            left: 10,
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
              <Slider {...sliderSettings}>
                {post.media.map((media, index) => (
                  <Box key={index}>
                    <ProtectedMedia
                      category="post"
                      mediaKey={media.url}
                      type={media.mime.includes('image') ? 'image' : 'video'}
                    />
                    {/* {media.mime.includes('image') ? (
                      <CardMedia
                        component="img"
                        height="200"
                        image={media.url}
                        alt={`Media ${index + 1} for post ${post.id}`}
                      />
                    ) : (
                      <CardMedia
                        component="video"
                        height="200"
                        src={media.url}
                        controls
                      />
                    )} */}
                  </Box>
                ))}
              </Slider>
            ) : (
              post.media.map((media, index) => (
                <Box key={index}>
                  {media.mime.includes('image') ? (
                    <CardMedia
                      component="img"
                      height="200"
                      image={media.url}
                      alt={`Media ${index + 1} for post ${post.id}`}
                    />
                  ) : (
                    <CardMedia
                      component="video"
                      height="200"
                      src={media.url}
                      controls
                    />
                  )}
                </Box>
              ))
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
          >
            <Favorite
              style={{
                color: 'red',
                marginRight: theme.spacing(0.3),
                fontSize: '1.2rem',
              }}
            />
            {post.likes.length}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PostCard;
