FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN mkdir -p /app/uploads/listings /app/uploads/hardware /app/uploads/users
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --legacy-peer-deps
COPY --from=build /app/dist ./dist
COPY --from=build /app/database ./database
EXPOSE 4000
CMD ["node", "dist/main.js"]

