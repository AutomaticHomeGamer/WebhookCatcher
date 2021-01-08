A small tool to quickly test sending webhook functionality of another app. 

A POST to localhost:8000/webhook/:name will create a timestamped entry with the data sent.

A GET to localhost:8000/webhook/:name/display will show all entries sent up until that point.

A GET to localhost:8000/webhook/:name/delete will clear all entries under that name.

You can have multiple webhooks at a time. IE localhost:8000/webhook/TestRun1, localhost:8000/webhook/TestRun2, 
localhost:8000/webhook/TestRun3, etc. They can be accessed and deleted independantly. 

If you don't need to keep a running log, but just want a quick check of the latest data sent you can use 
localhost:8000/endpoint  This doesn't need to be manually cleared out and only shows the most recent data
passed to it parsed as JSON. 

A Dockerfile and Docker-compose.yml have been provided for your convenience. 
docker build -t YourNameHere/webhook .
and
docker-compose up

Should get you up and running. 