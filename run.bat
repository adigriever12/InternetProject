cd %~dp0

@echo *** Start mongo db server ***
start cmd /k mongod.exe --dbpath mongodb\data

timeout 5
@echo *** Start node server ***
start cmd /k node server\server.js

timeout 5
start chrome.exe "http://localhost:8080/screen=3"

timeout 6
start chrome.exe "http://localhost:8080/TestUpdate?id=3"

@PAUSE