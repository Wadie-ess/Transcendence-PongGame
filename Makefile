prod:
	docker compose -f docker-compose.yaml up --build 
dev:
	docker compose -f docker-compose-dev.yaml up --build
devdown:
	docker compose -f docker-compose-dev.yaml down
proddown:
	docker compose -f docker-compose.yaml down
cleanall:
	docker system prune -af
	docker kill $(docker ps -q) || echo "No ps"
	docker volume rm `docker volume ls -q` || echo "No volumes" 
cleanv:
	docker volume rm `docker volume ls -q`
reprod:
	docker compose -f docker-compose.yaml down 
	docker compose -f docker-compose.yaml up --build
redev:
	docker compose -f docker-compose-dev.yaml down 
	docker compose -f docker-compose-dev.yaml up --build
	
