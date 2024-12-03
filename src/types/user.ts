import { Media } from './media';

export interface Profile {
  id: number;
  username: string;
  points: number;
  profilePic?: Pick<Media, 'url'>;
  createdAt: Date;
  _count: {
    workouts: number;
    comments: number;
  };
}

export type UserParentResource = Pick<
  Profile,
  'id' | 'username' | 'profilePic' | 'points'
>;
