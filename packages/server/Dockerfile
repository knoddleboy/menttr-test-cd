# Use Node.js LTS version
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package.json files for all packages
COPY packages/server/package.json ./packages/server/
COPY packages/web/package.json ./packages/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage for React app
FROM base AS web-builder
COPY ./packages/web ./packages/web
RUN pnpm --filter web build

# Build stage for NestJS server
FROM base AS server-builder
COPY ./packages/server ./packages/server
RUN pnpm --filter server build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/server/package.json ./packages/server/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built server application
COPY --from=server-builder /app/packages/server/dist ./packages/server/dist

# Copy built React app to server's static directory
# Adjust the destination path based on your NestJS static file configuration
COPY --from=web-builder /app/packages/web/dist ./packages/server/public
# Alternative if you use 'build' instead of 'dist':
# COPY --from=web-builder /app/packages/web/build ./packages/server/public

# Expose port (adjust if your NestJS server uses a different port)
EXPOSE 3000

# Set working directory to server package
WORKDIR /app/packages/server

# Start the application
CMD ["node", "dist/main.js"]