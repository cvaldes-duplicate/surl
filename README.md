# surl
node/mongo short url api

surla short urlusage:to set a urlhttp://qsoc.org/s?url=http://sample.com&t=samplewhere url= the url you want to redirect to[optional] t= friendly token you want to userif not token is provided, we auto gen a 5 char tokenit returns a simple json with the redirection url and an errorif there is an error no url is providedsample result: {"url":"http://qsoc.org/g/sample","error":""}to redirect the urlhttp://qsoc.org/g/sampleto list urlshttp://qsoc.org/listto enter url via a formhttp://qsoc.org/new
