import { Media } from '../types/media';

export function addTokenToMedia<T extends Pick<Media, 'url'> | undefined>(
  media: T,
  token: string,
): T {
  if (media) {
    const separator = media.url.endsWith('/') ? '' : '/';
    return {
      ...media,
      url: `${media.url}${separator}${token}`,
    };
  }
  return media;
}
