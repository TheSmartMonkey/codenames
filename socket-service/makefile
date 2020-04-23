# Deploy the server in a docker container
deploy:
	$(info Creating a docker container)
	docker build -t codenames-server:latest .
	docker run -p 8989:8989 -d codenames-server

# Build the python dependancies
build:
	$(info Building python dependancies)
	$(warning WIP)

# Tests
test:
	$(info Tests socket-service server)
	$(warning WIP)

# Run the server (for test purpose)
run:
	$(info Run the server (for test purpose))
	python server.py --host=0.0.0.0 --port=8989
