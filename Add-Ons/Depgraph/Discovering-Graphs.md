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

- [Directed discovery](#directed), using the dedicated `depgraph/resolve/*` REST resources
    
- [Inline discovery](#inline), as part of a larger process, by enabling the `resolve` field in a variety of JSON configurations POSTed to different depgrapher REST resources

For more information about these different discovery methods, see their respective sections below.

In addition to simply recursing through Maven POMs and extracting the straightforward expressions of project relationship contained within, the discovery process also makes provision for a couple of post-processing steps to be handled after parsing each POM:

- [Graph patching](#patching) is used to compensate for POM configurations that are expedient for the Maven build, but are misleading when it comes to constructing a graph of project interrelationship.

- [Metadata scanning](#scanning) is used to extract extra information from the parsed POMs and associated it with the project GAVs in the dependency graph. This metadata can then be used for collation of GAVs based on certain metadata characteristics or integration with third-party applications.

<a id="patching" name="patching" ></a>
## Graph Patching

Owing to some quirks in the way Maven projects are sometimes built, the standard dependencies declared in the POM do not always reflect the total set of GAVs the project relies upon. This means the depgraph discovery operation can easily miss critical, unorthodox relationships between projects.

Fortunately, most of these cases fall into a couple of neat patterns. To correct for these patterns, the depgrapher uses a set of patching components to revise the set of discovered relationships after parsing but before storage. Below are a couple of the more common patterns that the depgrapher knows how to patch:

- Assembly modules with `provided`-scope dependencies
- Use of the `dependency:copy`, or `dependency:unpack` goals, in the Maven Dependency Plugin

## Patching: Assembly Modules with Provided-Scope Dependencies

If you consider the way many large projects are built with Apache Maven, it's common to see small modules assembled into subsystems, which are then assembled into the distribution -- the binary that the community expects its users to download, install, and use. One of the most common approaches to this "rolling up" of project components into larger assemblies is the Maven Assembly Plugin. The assembly plugin is a tool for creating archives with flexible layouts according to one or more recipes (technically termed 'assembly descriptors'). The assembled archive is then typically attached to the Maven project instance and deployed alongside other project files, such as the POM and possibly other jars, etc.

It's fairly common to see communities create Maven modules whose sole responsibility is to generate these assembly archives. When that happens, there is no other output besides the assembly, so the POM is typically declared with:

```xml
<packaging>pom</packaging>
```

Additionally, since all of the dependencies declared in the module are designed to be aggregated into the assembly output archive, it's typically seen as the most technically correct thing to declare them all with `provided` scope.

The problem here is that many graph filters that are trying to judge the list of things that need to be built or included actually need to account for these provided-scope dependencies differently than the typical provided-scope dependency declaration. 

Provided scope is used to account for two use cases in Maven:

- The dependency is meant to be present in the runtime into which the binary will be deployed.

    Examples include javamail, cdi-api, etc.

- The dependency is being **embedded** into the binary that this build produces.

    In this case, the provided-scope dependency should not be included in Maven's transitive dependency set used to compile things that depend on this project...this is mainly a trick to hide the dependency from double-inclusion in Maven classpaths (one via the dependency declaration, the other embedded in the current project's jar).

In the case of these assembly-oriented modules, the provided scope is used to signify the **embedded** use case.

To make sure these project GAVs are included in the depgraph and available for building the current project (for example), the `dist-pom` patch modifies the assembly-oriented project's dependencies to **REMOVE** the provided scope. 

## Patching: Use of `dependency:copy` and `dependency:unpack`

The other common pattern--again, mainly related to assembly of project distributions--is use of the Maven Dependency Plugin. This plugin provides several goals that allow you to directly specify artifacts to resolve and copy or unpack, **without ever declaring them as dependencies**.

While there may be good reasons to leave such artifacts out of the project's dependency declarations, the depgraph is often incomplete without including them. They are necessary to construct a build environment in which the current project can be built, for example.

To make sure GAVs resolved on-the-fly by the dependency plugin are included in the dependency graph, the `dependency-plugin` patch looks for GAVs declared in the `configuration` section of the dependency plugin, and adds corresponding compile-scoped dependency relationships to the graph.

<a id="scanning" name="scanning" ></a>
## Metadata Scanning

The Maven POM contains a wealth of information that doesn't express relationships to other projects. Some of this information can be very useful in grouping GAVs that aren't directly related in the dependency graph, integrating the depgraph database information with a third party database, or conducting a review of some attribute of a project (project license, for instance).

To collect this information, the depgraph add-on provides a component interface called the `MetadataScanner`, along with a couple of implementations to capture some basic, common POM information. The default implementations extract SCM connection URL and license information and attach them as metadata to each project GAV in the graph.

The collected metadata can then be used in the `depgraph/meta/collate` ([Metadata.collate](Metadata#collate)) REST operation to group GAVs according to their values of certain configured metadata keys.

<a id="directed" name="directed" ></a>
##Directed Discovery

Directed discovery happens when you use the `depgraph/resolve` endpoint, as opposed to doing discovery as part of a larger operation you're trying to execute. Currently, this is a pretty simplistic operation, only allowing you to resolve the graph for a single GAV using an optional preset filter and a single source location (which can be an Aprox group reference). The basic call looks like this:

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

<a id="inline" name="inline" ></a>
## Discovery during Other Operations (Inline Discovery)

Many of the more sophisticated operations available in the depgraph add-on require you to POST a JSON configuration to specify exactly how these complex operations should execute. When this is the case, the `resolve` field should always be available. When set to `true`, graph discovery will take place before the operation can continue.

If you enable graph resolution during one of these operations, and some graph relationships already exist, the discovery manager will attempt to resume graph discovery with any unresolved relationship-target projects **that fit the specified filter**. Once a discovery iteration completes without adding any new relationships, discovery ends and the rest of the operation continues.

Operations that currently support this type of inlined discovery include:

- `depgraph/meta/collate` ([Metadata.collate](Metadata#collate))
- `depgraph/repo/*` ([Repository.*](Rendering/Repository))

