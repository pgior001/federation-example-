# federation-example

## How to run locally?

1. Download example
   ```sh
   curl -L https://github.com/graphql-hive/gateway/raw/refs/heads/main/examples/federation-example/example.tar.gz | tar -x
   ```

   ℹ️ You can download examples from other branches by changing the `/refs/heads/main` to the branch name (`/refs/heads/<branch_name>`) in the URL above.

1. Open example
   ```sh
   cd federation-example
   ```
1. Install
   ```sh
   npm i
   ```
1. Start service accounts
   ```sh
   npm run start
   ```

🚀 Then visit [localhost:4000/graphql](http://localhost:4000/graphql) to see Hive Gateway in action!

## Issue Reproduction


### Query

Run the following query against the gateway.

```gql
subscription Author {
  reviewAdded {
    author {
      id
    }
  }
}
```

### Starting Point

The following code snippet is being used to set the context on the web socket
server. If the context function is missing, I am unable to pass some of the
connection params to the downstream graph to be validated. However when the
function is present I get an issue with the gateway-runtime.

```
useServer(
  {
    schema: async () => gatewayRuntime.getSchema(),
    // This is where the error is happening, if we remove this context function, subscriptions work
    context(context) {
      console.log(context);
      return context;
    },
  },
  websocketServer
);
```

```log
{
   events: [
    {
      name: 'exception',
      attributes: {
        'exception.type': 'TypeError',
        'exception.message': "Cannot read properties of undefined (reading 'child')",
        'exception.stacktrace': "TypeError: Cannot read properties of undefined (reading 'child')\n" +
          '    at onSubgraphExecute (file:///Users/preston.giorgianni/Documents/GitHub-Repos/gss-servicegraph/node_modules/@graphql-hive/gateway-runtime/dist/index.js:1500:46)\n' +
          '    at <anonymous> (/Users/preston.giorgianni/Documents/GitHub-Repos/gss-servicegraph/node_modules/@graphql-mesh/fusion-runtime/dist/index.js:1053:36)\n' +
          '    at handleCallback (file:///Users/preston.giorgianni/Documents/GitHub-Repos/gss-servicegraph/node_modules/@whatwg-node/promise-helpers/esm/index.js:98:20)\n' +
          '    at Promise.then (file:///Users/preston.giorgianni/Documents/GitHub-Repos/gss-servicegraph/node_modules/@whatwg-node/promise-helpers/esm/index.js:34:40)\n' +
          '    at handleMaybePromise (file:///Users/preston.giorgianni/Documents/GitHub-Repos/gss-servicegraph/node_modules/@whatwg-node/promise-helpers/esm/index.js:10:33)\n' +
          '    at iterate (file:///Users/preston.giorgianni/Documents/GitHub-Repos/gss-servicegraph/node_modules/@whatwg-node/promise-helpers/esm/index.js:97:16)\n' +
          '    at handleCallbackResult (file:///Users/preston.giorgianni/Documents/GitHub-Repos/gss-servicegraph/node_modules/@whatwg-node/promise-helpers/esm/index.js:106:20)\n' +
          '    at Promise.then (file:///Users/preston.giorgianni/Documents/GitHub-Repos/gss-servicegraph/node_modules/@whatwg-node/promise-helpers/esm/index.js:34:40)\n' +
          '    at handleMaybePromise (file:///Users/preston.giorgianni/Documents/GitHub-Repos/gss-servicegraph/node_modules/@whatwg-node/promise-helpers/esm/index.js:10:52)\n' +
          '    at iterate (file:///Users/preston.giorgianni/Documents/GitHub-Repos/gss-servicegraph/node_modules/@whatwg-node/promise-helpers/esm/index.js:97:16)'
      },
      time: [ 1759515444, 255750100 ],
      droppedAttributesCount: 0
    }
}
```