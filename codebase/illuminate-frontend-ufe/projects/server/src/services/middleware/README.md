## The middleware is expressjs middleware

### Middleware recommendations
* Files should be small, ideally less than 50 lines of code, and no more than 200 lines of code
* The middleware takes 3 argumentsrequest, response, and next
* The next function must be called in the middleware unless the request is completely processed by the middleware and either response.end or a redirect is sent
* No heavy computation should be done in middleware
* Middelware is added using app.use() 
* URL path can be specified for middleware so it only runs on certain paths
* More information here https://confluence.sephora.com/wiki/display/FEE/Working+in+JERRI+Code 
