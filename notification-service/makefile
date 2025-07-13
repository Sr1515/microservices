build: 
	docker compose up --build --remove-orphans -d

run-consumer:
	python3 manage.py runconsumer

logs:
	docker compose logs -f

run: 
	python3 manage.py runserver

mk: 
	docker compose run --rm api poetry run python3 manage.py makemigrations

mg: 
	docker compose run --rm api poetry run python3 manage.py migrate

off: 
	docker compose down

off-v:
	docker compose down -v

reset:
	make off-v && make build && make mk && make mg && make sp
