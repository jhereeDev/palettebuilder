module.exports = {
  apps: [
    {
      name: "palettebuilder",
      script: "npm",
      args: "start",
      cwd: "/var/www/palettebuilder",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3101,
        DATABASE_URL: "postgresql://devuser:devpass123@192.168.1.12:5432/devdb",
        CLERK_SECRET_KEY: "sk_test_placeholder_replace_with_actual_key",
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_placeholder_replace_with_actual_key",
        NEXTAUTH_URL: "http://192.168.1.12:3101",
        NEXTAUTH_SECRET: "nextauth_secret_placeholder_replace_with_actual_secret",
      },
      error_file: "/var/log/pm2/palettebuilder-error.log",
      out_file: "/var/log/pm2/palettebuilder-out.log",
      log_file: "/var/log/pm2/palettebuilder-combined.log",
      time: true,
    },
  ],
};