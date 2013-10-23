<!-- Freeki metadata. Do not remove this section!
TITLE: Discovering-Graphs
-->
#Discovering Graphs

Once you've [created a workspace](Workspaces#creating), you're ready to discover a dependency graph. Discovery currently amounts to parsing a series of POMs recursively, extracting the inter-project relationship information from them, and recursing to discover the projects those relationships target.

Graph discovery can happen in two ways:

- Using the dedicated `depgraph/resolve/*` REST resources
- Enabling the `resolve` field in a variety of JSON configurations POSTed to different depgrapher REST resources

### Reminder {.sidebar}

All REST URLs in Aprox are prefixed with the path: `api/1.0/`. Accordingly, if your Aprox instance is deployed to the `/aprox` path on your webserver, the full path to the resolver URL will be: `/aprox/api/1.0/depgraph/resolve/*`.


