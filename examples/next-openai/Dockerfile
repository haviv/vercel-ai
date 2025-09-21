# Use Node.js 20 with Alpine Linux
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies (this will fail initially due to workspace setup)
# We'll handle workspace dependencies differently
RUN apk add --no-cache git

# Copy the entire workspace context
COPY . ./

# Development stage
FROM base AS development

# Set the working directory to the Next.js app
WORKDIR /app

# Expose port 3000
EXPOSE 3000

# Set environment to development
ENV NODE_ENV=development

# Command to run the development server
CMD ["pnpm", "dev"]
