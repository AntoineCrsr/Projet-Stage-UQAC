Run the Backend:

#### Using Docker

Commands:

```
docker build -t api-uqac-project .

docker run -d -p 3000:3000 api-uqac-project

```

If it doesn't work, sometimes the problem come from docker itself, you just have to run docker desktop and it works.

#### Using node

```
cd backend

npm install

node server

```
