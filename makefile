# Deploy the server in a docker container
deploy:
	cd socket-service && make deploy

# Build the entier project
build:
	cd socket-service && make build

# Tests the entier project
test:
	cd socket-service && make test

# Run the server (for test purpose)
run:
	cd socket-service && make run
