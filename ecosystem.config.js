module.exports = {
  apps: [
    {
      name: "edutech task app",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/",
    },
  ],
};