# Simple TS App
The simple app is to continue the [learn-pubsub](https://github.com/YiyangLi/learn-pubsub) project. It's a publisher app that sends messages to the pubsub app. The pubsub app is run in express.js.

## Requirements
### Basic
- Send a http request to an api endpoint that contains the message. If not specified, the message is randomly generated. 
- Send messages concurrently, try to achieve a higher throughput.
- If the api (in the pubsub app) accepts a batch of events, cache events in memory firstly and send a batch.
- Read the configuration for the pubsub app from `.env` or environments. 
- Wrap the app in a command line, read the message and the message numbers from parameters. If not specified, read `.env` or environment variables. 

### Advanced
- Dockerize it, try to keep the docker image small and the container lightweight. 
- Put it under k8s (minikube), and draft the kustomization plan. 
- Draft the terraform for EKS.
