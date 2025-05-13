FROM node:24-alpine3.20

WORKDIR /app

COPY package*.json ./  

ENV NODE_ENV=development

RUN npm install  

COPY . .  

EXPOSE 3001  

CMD ["npm", "run", "production"]