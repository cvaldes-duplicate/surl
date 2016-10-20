# surl
node/mongo short url api

surl
a short url
usage:
to set a url
  http://qsoc.org/s?url=http://sample.com&t=sample
    where url= the url you want to redirect to
    [optional] t= friendly token you want to use
    if not token is provided, we auto gen a 5 char token
    it returns a simple json with the redirection url and an error
    if there is an error no url is provided
    sample result: {"url":"http://qsoc.org/g/sample","error":""}
    
    to redirect the url
    http://qsoc.org/g/sample
    
    to list urls
    http://qsoc.org/list
    
    to enter url via a form
    http://qsoc.org/new
