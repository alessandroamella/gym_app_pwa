export const apps = [
  {
    name: 'Gym app backend',
    script: 'pnpm',
    args: 'build && pnpm start',
    env: {
      NODE_ENV: 'production',
      PORT: 1447,
      BACKEND_URL: 'https://gym-app-backend.bitrey.it/v1',
    },
    interpreter: 'bash',
  },
];

export default apps;
