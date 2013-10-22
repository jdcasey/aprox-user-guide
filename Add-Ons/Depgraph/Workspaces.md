<!-- Freeki metadata. Do not remove this section!
TITLE: Workspaces
-->
#Workspaces

The depgraph add-on uses an artifact identity and artifact-relationship database API called [Atlas](https://github.com/jdcasey/atlas), which stores dependency graphs in databases that are each associated with a workspace. Separation by workspace allows different dependency graphs to be loaded and unloaded according to the needs of the requests being serviced. This saves memory on the server and improves overall system performance, while at the same time enabling users to explore different scenarios with different configurations in parallel without affecting one another.

##Creating a new workspace

Currently, before you can start resolving a dependency graph you must first create a workspace. This can be done via a simple POST request to the `ws/new` resource:

```bash
$ curl -i -X POST http://localhost:8080/aprox/api/1.0/depgraph/ws/new

HTTP/1.1 201 Created
Server: Apache-Coyote/1.1
Location: http://localhost:9080/aprox/api/1.0/depgraph/ws/1382474661713
Content-Type: application/json
Content-Length: 103
Date: Tue, 22 Oct 2013 20:44:24 GMT

{
  "config": {
    "forceVersions": true
  },
  "id": "1382474661713",
  "lastAccess": 1382474663986
}
```

The most important field in the returned JSON is the `id` field. This is your workspace identifier, and itâ€™s used throughout the depgrapher REST services.

<span style="sidenote">
##Deleting a workspace

As you explore different configurations for your dependency graphs, occasionally you will want to delete old, obsolete dependency graphs. This is an easy operation; simply issue the following DELETE request (using your own workspace-id for the last part of the path):

```bash
$ curl -i -X DELETE http://localhost:8080/aprox/api/1.0/depgraph/ws/1382474661713

HTTP/1.1 200 OK
Server: Apache-Coyote/1.1
Content-Length: 0
Date: Tue, 22 Oct 2013 20:49:49 GMT

```
