@echo "RestAPI"
cd web & npm install & npm run build & cd ../ & npm install --production & node ./bin/www
pause 