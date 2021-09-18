A small tool to quickly test sending webhook functionality of another app. 

A POST to localhost:8000/webhook/:name will create a timestamped entry with the data sent.

A GET to localhost:8000/webhook/:name/display will show all entries sent up until that point.

A GET to localhost:8000/webhook/:name/delete will clear all entries under that name.

A GET to localhost:8000/list will show all existing webhooks

A GET to localhost:8000/webhook/:name/count will give you a count of how many entries there are.

A GET to localhost:8000/webhook/:name/count/:startTime/:duration will give you a count of how many entries have been made within :duration seconds after :startTime(milliseconds since Unix Epoch)
IE: localhost:8000/webhook/testWebhook/count/1631979950610/30 would get all entries made within the 30 second window following 1631979950610  You can use the time field on any entry as :startTime

You can have multiple webhooks at a time. IE localhost:8000/webhook/TestRun1, localhost:8000/webhook/TestRun2, 
localhost:8000/webhook/TestRun3, etc. They can be accessed and deleted independantly. 

If you don't need to keep a running log, but just want a quick check of the latest data sent you can use 
localhost:8000/endpoint  This doesn't need to be manually cleared out and only shows the most recent data
passed to it parsed as JSON. Accepts POST and GET

A Dockerfile and Docker-compose.yml have been provided for your convenience. 
docker build -t YourNameHere/webhook .
and
docker-compose up

Should get you up and running. 

If you already have mongo running on the default port you can use:
    
