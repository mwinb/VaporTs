# Doc-TS Example

Install  
`npm i`

Build  
`npm build`

Start - runs build then executes dist/main.js  
`npm start`

Running tests on loop  
`npm test`

Running unit tests once with coverage  
`npm run test:unit`

Building with docker:  
`npm run build && docker build -t ts_starter .`

Running docker:  
`docker run --name ts_starter -p 5000:5000 ts_starter`
