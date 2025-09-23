# Production Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory to the workspace root
WORKDIR /app

# Copy the entire workspace (excluding node_modules via .dockerignore)
COPY . .
COPY .env.production .env
# Clean all node_modules and install dependencies
# RUN find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
RUN pnpm install

# Install the required packages using pnpm in the root monorepo folder
RUN pnpm build --filter @ai-sdk/react
RUN pnpm build --filter @ai-sdk/openai

# Set working directory to the Next.js app
WORKDIR /app/examples/next-openai

# Install dependencies for the Next.js app
RUN pnpm install

# Build the application
RUN pnpm build

# Expose port 3000
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Command to run the production server
CMD ["pnpm", "start"]
