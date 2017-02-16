timestamp=`date +"%Y%m%d%H%M%S"`

lift:
	./node_modules/forever/bin/forever app.js

daemom:
	./node_modules/pm2/bin/pm2 start node-http-proxy.js -i 4

status:
	./node_modules/pm2/bin/pm2 list

stop:
	./node_modules/pm2/bin/pm2 delete all

restart:
	./node_modules/pm2/bin/pm2 restart all

graceful:
	./node_modules/pm2/bin/pm2 gracefulReload all

rotate-log:
	./node_modules/pm2/bin/pm2 reloadLogs

rotate-flush:
	./node_modules/pm2/bin/pm2 flush

logs:
	./node_modules/pm2/bin/pm2 logs

package:
	npm cache clean
	rm -rf node_modules
	@npm install
	tar -vzcf local-crm-reverse-proxy-$(timestamp).tar.gz2 ./*
