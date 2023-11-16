FROM node:18

# Create app directory
WORKDIR /app

# Install prisma for the migration
RUN npm install -g prisma --unsafe-perm

# Copy schema and migration folder
ADD ./ ./prisma/

# Run migration
CMD ["prisma", "migrate", "deploy"]