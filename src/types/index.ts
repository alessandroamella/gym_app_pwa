// User types
export interface Profile {
  id: number;
  username: string;
  points: number;
  profilePicUrl?: string;
  createdAt: Date;
  _count: {
    workouts: number;
    comments: number;
  };
}

export type WorkoutUser = Pick<Profile, 'id' | 'username' | 'profilePicUrl'>;

export interface CommentUser extends WorkoutUser {}

export interface WorkoutMedia {
  url: string;
  mime: string;
}

// Comment type
export interface WorkoutComment {
  id: number;
  text: string;
  createdAt: Date;
  user: CommentUser;
}

// Base workout type (assuming these fields from GetAllWorkoutsResponseDto)
export interface BaseWorkout {
  id: number;
  title: string;
  durationMin: number;
  description: string;
  createdAt: Date;
  notes?: string;
  updatedAt: Date;
  user: WorkoutUser;
  media: WorkoutMedia[];
  // Add any other fields that are in GetAllWorkoutsResponseDto
}

// Response type for getting all workouts
export interface GetAllWorkoutsResponse extends BaseWorkout {
  // Any additional fields specific to the list view
  _count: {
    comments: number;
  };
}

// Response type for getting a single workout
export interface GetWorkoutResponse extends BaseWorkout {
  comments: WorkoutComment[];
}

// If you need type guards
export const isWorkoutResponse = (
  workout: GetAllWorkoutsResponse | GetWorkoutResponse,
): workout is GetWorkoutResponse => {
  return 'comments' in workout;
};

// For API functions, you might use them like this:
export type GetAllWorkoutsFunction = () => Promise<GetAllWorkoutsResponse[]>;
export type GetWorkoutFunction = (id: number) => Promise<GetWorkoutResponse>;
