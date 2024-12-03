import { useState, useEffect, FC } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

interface ProtectedMediaProps {
  mediaKey: string;
  category: string;
  type: 'image' | 'video'; // Specify the type of media
}

const ProtectedMedia: FC<ProtectedMediaProps> = ({
  mediaKey,
  category,
  type,
}) => {
  const token = useAuthStore((state) => state.token);

  const [mediaSrc, setMediaSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axios.get(`/v1/${category}/media/${mediaKey}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob', // Expect binary data
        });

        const objectUrl = URL.createObjectURL(response.data);
        setMediaSrc(objectUrl);

        return () => {
          URL.revokeObjectURL(objectUrl); // Cleanup when component unmounts
        };
      } catch (err) {
        console.error('Error fetching media:', err);
        setError('Unable to load media');
      }
    };

    fetchMedia();
  }, [mediaKey, token]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!mediaSrc) {
    return <div>Loading...</div>;
  }

  return type === 'image' ? (
    <img src={mediaSrc} alt="Protected" />
  ) : (
    <video controls>
      <source src={mediaSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default ProtectedMedia;
