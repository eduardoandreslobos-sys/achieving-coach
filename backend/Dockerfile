FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Build TypeScript
RUN npm install -D typescript @types/node
RUN npm run build

# Expose port
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
