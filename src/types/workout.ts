import { Media } from './media';
import { UserParentResource } from './user';

interface BaseWorkout {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  description: string;
  createdAt: Date;
  notes?: string;
  updatedAt: Date;
  user: UserParentResource;
  media: Media[];
  points: number;
}

export type WorkoutData = Pick<BaseWorkout, 'startDate' | 'endDate' | 'notes'>;

export interface WorkoutComment {
  id: number;
  text: string;
  createdAt: Date;
  user: UserParentResource;
}

export interface GetAllWorkoutsResponse extends BaseWorkout {
  _count: {
    comments: number;
  };
}

export interface GetWorkoutResponse extends BaseWorkout {
  comments: WorkoutComment[];
}
