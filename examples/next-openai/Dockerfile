# Use Node.js 20 with Alpine Linux
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory to the workspace root
WORKDIR /app

# Copy the entire workspace
COPY . .

# Install dependencies
RUN pnpm install

# Set working directory to the Next.js app
WORKDIR /app/examples/next-openai

# Expose port 3000
EXPOSE 3000

# Set environment to development
ENV NODE_ENV=development

# Command to run the development server
CMD ["pnpm", "dev"]
