module.exports = {
  apps: [
    {
      name: "kiyim-chechak-backend",
      cwd: "./backend",
      script: "dist/server.js",
      instances: 1,
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
