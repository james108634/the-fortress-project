FROM node:20-alpine
WORKDIR /app

# Copy package manifests first
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the code (server.js, .env, etc.)
COPY . .

# Environment
ENV PORT=4000
EXPOSE 4000

CMD ["node", "server.js"]
