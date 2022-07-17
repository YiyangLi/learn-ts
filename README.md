# Simple TS App
The simple app is to continue the [learn-pubsub](https://github.com/YiyangLi/learn-pubsub) project. The pubsub app, run in express.js, offers a `/publish` endpoint to accept messages. Previously, when the command `pubsubyy publish <topic>` is called, only one message is sent. And using a for-loop in shell sends messages sequentially. The project here will send multiple messages concurrently or in several batches to the publish endpoint

## Roadmaps
### V0
[ ] Send an HTTP request to the publish endpoint and print if error. If not specified, the message is randomly generated. 
[ ] Send messages sequentially, concurrently. 
[ ] Send messages in batches, where all batches are sent concurrently, and each element in a is sent sequentially. i.e. The total batch size is the max concurrency. 
[ ] Read the base_url for the pubsub app from `.env` or environment variables. 
[ ] Wrap the app in a command line, set the message and the message numbers through parameters. If not specified, read `.env` or environment variables. 

### V1
[ ] Add jest and nock for testing
[ ] Support different log levels

### V2
[ ] If the API (in the pubsub app) accepts a batch of events, cache events in memory first and send a batch.
[ ] Dockerize the project, try to keep the docker image small and the container lightweight. 

### V3
[ ] Put it under k8s (minikube), and draft the kustomization plan. 
[ ] Draft the terraform for EKS.

## Run it without docker
Build it
```
npm install
npm link
```

Run it
```
simple send
```

Need help?
```
simple --help
simple [command]

Commands:
  simple send  send messages

Options:
      --help         Show help                                         [boolean]
      --version      Show version number                               [boolean]
  -m, --message      the message                          [string] [default: ""]
  -n, --size         total message size                   [number] [default: 10]
  -s, --seq          send message in a sequence       [boolean] [default: false]
  -l, --log          log results                      [boolean] [default: false]
  -c, --concurrency  max concurrency                      [number] [default: -1]
```

### Example commands
Send 10 messages sequentially
```
simple send -n 10 -s
```

Send 10 messages concurrently
```
simple send -n 10 -s
```

Send 10 messages concurrently in 2 batches, aka the concurrency is 2
```
simple send -n 10 -c 2 -s
```

## Run it with docker
Build it
```
docker build --tag node-docker .
```

Run it with default `.env`
```
docker run node-docker
```

Run it with overwritten environment variables
```
docker run --env SIZE=10 -e CONCURRENCY=2 node-docker
```

Run it with commands
```
docker run node-docker simple send -n 10 -c 2 --log
```

Need help?
```
docker run node-docker simple --help
```
