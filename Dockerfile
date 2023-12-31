FROM node as react-build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=react-build /app/build /usr/share/nginx/html
