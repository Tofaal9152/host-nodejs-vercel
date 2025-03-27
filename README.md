# NODEJS TEMPLATE

Build the Docker Image:
docker build -t my-node-app .

Run the Container:
docker run -p 4040:4040 --env-file .env my-node-app
