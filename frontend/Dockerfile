FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build (usará .env.production con valores dummy)
RUN npm run build

# Production image
FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production

# Install bash for the start script
RUN apk add --no-cache bash

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm install --production

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Copy start script
COPY start.sh ./
RUN chmod +x start.sh

# Expose port
EXPOSE 3000

# Start with our custom script
CMD ["./start.sh"]
