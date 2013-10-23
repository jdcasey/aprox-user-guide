<!-- Freeki metadata. Do not remove this section!
TITLE: Workspaces
-->
#Workspaces

The depgraph add-on uses an artifact identity and artifact-relationship database API called [Atlas](https://github.com/jdcasey/atlas), which stores dependency graphs in databases that are each associated with a workspace. Separation by workspace allows different dependency graphs to be loaded and unloaded according to the needs of the requests being serviced. This saves memory on the server and improves overall system performance, while at the same time enabling users to explore different scenarios with different configurations in parallel without affecting one another.

<a id="creating"></a>
##Creating a New Workspace

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

The most important field in the returned JSON is the `id` field. This is your workspace identifier, and it's used throughout the depgrapher REST services.

<a id="deleting"></a>
##Deleting a Workspace

As you explore different configurations for your dependency graphs, occasionally you will want to delete old, obsolete dependency graphs. This is an easy operation; simply issue the following DELETE request (using your own workspace-id for the last part of the path):

```bash
$ curl -i -X DELETE http://localhost:8080/aprox/api/1.0/depgraph/ws/1382474661713

HTTP/1.1 200 OK
Server: Apache-Coyote/1.1
Content-Length: 0
Date: Tue, 22 Oct 2013 20:49:49 GMT

```

<a id="listing"></a>
##Listing Available Workspaces

Occasionally, it will also be useful to see what workspaces are available on the system. This amounts to a simple GET request, and returns a JSON object containing the workspaces within an `items` field:

```bash
$ curl -i http://localhost:8080/aprox/api/1.0/depgraph/ws

HTTP/1.1 200 OK
Server: Apache-Coyote/1.1
Content-Type: application/json
Content-Length: 227
Date: Tue, 22 Oct 2013 21:12:22 GMT

{
  "items": [
    {
      "config": {
        "activeSources": [
          "aprox:repository:central"
        ],
        "forceVersions": true
      },
      "id": "1381956712063",
      "lastAccess": 1381961699000
    }
  ]
}
```

Again, the `items` field is an array of workspace objects.

<a id="advanced"></a>
## Advanced Topics

### Constraints

In the above examples, you probably noticed a lot of other fields beyond just the `id`. These fields are used to constrain the sources used when traversing a graph's relationships (read: the repository URLs that are allowed in results), and also the locations within the original Maven POM that are available to the traversal (read: active profiles).

By default, dependency-graph discovery will automatically add any source locations it encounters to the list of `activeSources` in the workspace. This stands to reason, since you probably want to be able to access any information you gather during discovery.

However, since relationships in all profiles (as well as the POM's root) are always discovered, the same isn't true for activating POM locations. By default, only the POM root is active unless the workspace is specifically configured to activate a particular profile-id.

To activate a profile-id, send a PUT request as follows (substituting the appropriate workspace-id and profile-name, of course):

```bash
$ curl -i -X PUT http://localhost:8080/aprox/api/1.0/depgraph/ws/1382477279014/profile/my-profile

HTTP/1.1 200 OK
Server: Apache-Coyote/1.1
Content-Type: application/json
Content-Length: 169
Date: Tue, 22 Oct 2013 21:29:05 GMT

{
  "config": {
    "activePomLocations": [
      "pom:profile:my-profile"
    ],
    "forceVersions": true
  },
  "id": "1382477279014",
  "lastAccess": 1382477345756
}
```

### Version Selection

In addition, workspaces also store GAV selections. Selections allow you to specify that the version `org.foo:bar:1.2.3` should be used when the graph encounters a variable version, such as the range `org.foo:bar:[1.0,1.4]`. In some cases, it's useful to force a version selection; that is, create this sort of substitution even when the original version **isn't** variable. For instance, to force references to `org.foo:bar:1.2` in the dependency graph to instead use `org.foo:bar:1.8`.

To select a version, send a GET request as follows (with the appropriate workspace-id and GAV information):

```bash
$ curl -i http://localhost:8080/aprox/api/1.0/depgraph/ws/1382477279014/select/org.foo/bar/1.2.3

HTTP/1.1 200 OK
Server: Apache-Coyote/1.1
Content-Type: application/json
Content-Length: 169
Date: Tue, 22 Oct 2013 21:32:58 GMT
```
```javascript
{
  "config": {
    "forceVersions": true
  },
  "id": "1382477279014",
  "lastAccess": 1382477578911
}
```

#### TODO

You'll notice that the selection isn't stored in the workspace object itself. Unfortunately, the corresponding query hasn't yet been created to find out what selections have been imposed.
