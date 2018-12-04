FROM node:8

# Who(m) to blame if nothing works
MAINTAINER tomcat_iv@yahoo.com

# Create a working directory 
RUN mkdir -p /usr/src/app
 
# Switch to working directory
WORKDIR /usr/src/app
 
# Copy contents of local folder to `WORKDIR`
# You can pick individual files based on your need
COPY . .
 
# Install nodemon globally
RUN npm install -g nodemon

# Install request-promise cheerio and puppeteer

RUN npm install --save request-promise cheerio puppeteer 

# Install dependencies (if any) in package.json
RUN npm install

# install angular
RUN npm install -g @angular/cli

# Expose port from container so host can access 3000
EXPOSE 3000
 
# Start the Node.js app on load
CMD [ "npm", "start" ]
