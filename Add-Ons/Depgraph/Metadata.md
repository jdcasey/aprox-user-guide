<!-- Freeki metadata. Do not remove this section!
TITLE: Metadata
-->
#Metadata Operations

The metadata REST resource provides endpoints for querying and updating the metadata attached to GAVs in the dependency graph. The base resource path for these endpoints is `depgraph/meta/`.

<div class="start-sidebar" id="sidebar1"></div>
### Reminder

All REST URLs in Aprox are prefixed with the path: `api/1.0/`. Accordingly, if your Aprox instance is deployed to the `/aprox` path on your webserver, the full path to the metadata resource will be: `/aprox/api/1.0/depgraph/meta/*`.

This is another paragraph for testing styles.
<div class="end-sidebar"></div>

These include:

- Assembling a collated a set of GAVs according to their values of one or more metadata keys

- Getting all metadata attached to a given GAV

- Getting a specific metadata value for a given key and GAV

- Updating one or more metadata key-value pairs for a given GAV

- Batch-updating a mapping of metadata key-value pairs, each associated with a GAV


##Collating Sets of GAVs {#collate}

One of the most important operations we can perform with metadata attached to GAVs in a dependency graph is to group them according to the value of one or more metadata keys. This allows us to find out which GAVs have some attribute in common. 

This feature can really come to life when combined with the [metadata scanning](Discovering-Graphs#scanning) that takes place during graph discovery, where both project licensing and SCM information is captured by default. These common values provide a handy way to perform license reviews (from the license metadata), or to get a rough idea about what artifacts were produced by a common Maven build (using the scm metadata).

### License Reviews

For example, if you want to know what licenses are in use in the dependencies your project relies on, you might try something like this:

First, construct the JSON configuration for this collation:

```javascript
{
  "resolve": true,
  "source": "repository:central",
  "workspaceId": "1382736141209",
  "keys": [
    "license-url"
  ],
  "graphComposition": {
    "graphs": [
      {
        "roots": ["org.commonjava.maven.atlas:atlas-driver-neo4j-embedded:0.9.1"],
        "preset": "sob-build"
      }
    ]
  },
  "patcherIds": [
    "dependency-plugin",
    "dist-pom"
  ]
}
```

Then, POST it to the `depgraph/meta/collate` endpoint:

```bash
$ curl -i \
         -X POST \
         -H 'Content-type: application/json' \
         --data @collate.json \
         http://localhost:8080/aprox/api/1.0/depgraph/meta/collate

[...time passes...]


```

