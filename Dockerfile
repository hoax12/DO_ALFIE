# --- Stage 1: Build the React Frontend ---
FROM node:20 as build-stage
WORKDIR /app/frontend
COPY alfie-frontend/package*.json ./
RUN npm install
COPY alfie-frontend/ ./
RUN npm run build

# --- Stage 2: Setup Python & Serve Everything ---
FROM python:3.12-slim
WORKDIR /app

# Install Backend dependencies
COPY alfie-backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY alfie-backend/ ./

# Copy the built React files from Stage 1 into a folder Python can see
COPY --from=build-stage /app/frontend/dist ./static

# Expose port and run with a slight change to serve static files
EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]