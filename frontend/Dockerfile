# Step 1: Use a Node.js base image
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy all the source files to the container
COPY . .

# Step 6: Expose the port Vite dev server uses (default is 5173)
EXPOSE 5173

# Step 7: Set the command to start the Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]
