# =============================================================================
# Backend Development Dockerfile
# =============================================================================

FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache \
    curl \
    postgresql-client \
    bash \
    openssl \
    libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --include=dev

# Copy project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Give execute permission to start script
RUN chmod +x scripts/start-dev.sh

# Expose port
EXPOSE 4000

# Start command
CMD ["./scripts/start-dev.sh"]
