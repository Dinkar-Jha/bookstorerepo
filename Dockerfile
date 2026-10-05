# Stage 1: Build static assets
FROM registry.redhat.io/ubi9/nodejs-20-minimal:latest AS builder

USER root
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with non-root minimal container
FROM registry.redhat.io/ubi9/ubi-minimal:latest

# Create non-root user
RUN microdnf update -y && \
    microdnf install -y nodejs && \
    microdnf clean all && \
    useradd -m -u 1001 appuser

WORKDIR /app

# Copy built application and install lightweight static server
COPY --from=builder --chown=appuser:appuser /app/dist ./dist
RUN npm install -g serve

# Switch to non-root user (P0 Compliance)
USER 1001

# Expose internal port
EXPOSE 5173

# Bind specifically to localhost/127.0.0.1
CMD ["serve", "-s", "dist", "-l", "5173"]
