# TODO Application with Node.js 

ToDo application using Node.js as backend.

## To run the TODO App - Follow the steps

### Clone the repo

```
git clone https://github.com/arjunksofficial/todo-node.git
```

### Creating the RSA keys

Create two files private.key and public.key under folder **__/todo-node/backEnd/keys__** by generating the keys from sites like http://travistidwell.com/jsencrypt/demo/ and store in the respective files.

### Install all dependencies

Run npm install

```
npm install
```

### Install nodemon

To install nodemon globally, Run.

```
npm install -g nodemon
```

### Configure the configuration file

Edit the file **__todo-node/backEnd/config/development.json__** according to your system configuration and set up MySQL configuraions.

### To run the TODO Application

Open two terminal in **__/todo-node__** folder and run the following command.

#### Terminal 1

To run back-end server

```
nodemon ./backEnd/serverback.js
```

#### Terminal 2

To run front-end server

```
nodemon ./frontEnd/serverFront.js
```

After running those two servers navigate to http://localhost:8000 from Google Chrome browser. The username is **__arjun__** and password is **__qburst__**. 

## To run ESLint for whole project, Run the following command


```
eslint --ext .js .
```
