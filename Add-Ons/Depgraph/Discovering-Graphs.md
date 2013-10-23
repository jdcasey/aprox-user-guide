<!-- Freeki metadata. Do not remove this section!
TITLE: Discovering-Graphs
-->
#Discovering Graphs

Once you've [created a workspace](Workspaces#creating), you're ready to discover a dependency graph. Discovery currently amounts to parsing a series of POMs recursively, extracting the inter-project relationship information from them, and recursing to discover the projects those relationships target.

<div class="start-sidebar" id="sidebar1"/>
### Reminder

All REST URLs in Aprox are prefixed with the path: `api/1.0/`. Accordingly, if your Aprox instance is deployed to the `/aprox` path on your webserver, the full path to the resolver URL will be: `/aprox/api/1.0/depgraph/resolve/*`.

This is another paragraph for testing styles.
<div class="end-sidebar"/>

Graph discovery can happen in two ways:

- Using the dedicated `depgraph/resolve/*` REST resources
- Enabling the `resolve` field in a variety of JSON configurations POSTed to different depgrapher REST resources

###Directed Discovery

Directed discovery happens when you use the `depgraph/resolve` endpoint, as opposed to doing discovery as part of a larger operation you're trying to execute.

Directed discovery is currently pretty simplistic, allowing you to resolve the graph for a single GAV using an optional preset filter and a single source location (which can be an Aprox group reference). The basic call looks like this:

```
http://localhost:8080/aprox/api/1.0/depgraph/resolve/group:public/org.foo/bar/1.2.3?wsid=1382477279014&preset=sob-build
```

<div class="start-sidebar" id="sidebar2"/>
###Note

Currently, the `wsid=xxxxxxxxx` query parameter is a common method of passing in the workspace used to store/query for graph information. **In most cases, the workspace is a required parameter.** 

This violates the principle of *required parameters in the path, optional parameters in the query* specified [at the beginning of this section](Main#interface-patterns), and is a holdover from an older incarnation of the dependency graph, in which all relationships were stored in a global database, and workspaces merely specified a view on that database.

**This means of specifying the workspace will likely change.**
<div class="end-sidebar"/>

Let's take a look at the individual parts:

- `http://localhost:9080/aprox/api/1.0/depgraph/resolve`: By now, this should look pretty familiar. This is the base URL for the resolver REST endpoint

- `group:public`: This specifies that the graph should be resolved using the Aprox group `public` as the source from which POMs will be downloaded and parsed.

- `org.foo/bar/1.2.3`: This is the topmost GAV for the graph to be resolved. 

    All dependencies, plugins, extensions, parents, etc. references to other projects recursing out from this GAV will be collected, subject to acceptance by the preset filter.

- `wsid=1382477279014`: This specifies the workspace within which to store the resolved graph. 

- `preset=sob-build`: This specifies the preset filter to use in order to determine which parts of the dependency graph to recurse during discovery. For more information on filtering and available presets, see the [Filtering](Filtering) section.



