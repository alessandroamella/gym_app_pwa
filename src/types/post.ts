import { Media } from './media';
import { UserParentResource } from './user';

interface BasePost {
  id: number;
  createdAt: Date;
  text?: string;
  media: Media[];
  user: UserParentResource;
  likes: PostLike[];
}

export type PostData = Pick<BasePost, 'text'>;

export interface PostLike {
  user: UserParentResource;
  createdAt: Date;
}

export interface GetAllPostsResponse extends BasePost {}
