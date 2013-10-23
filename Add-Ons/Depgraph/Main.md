<!-- Freeki metadata. Do not remove this section!
TITLE: Main
-->
#Depgraph Add-On User Guide

The depgraph add-on is an integration point for the [Cartographer API][1], which is a system to capture, traverse, and analyze relationships between projects. Currently, it only supports Maven-style artifacts.

## Contents

* Overview
    * [Basic Features](Main#basic-features)
    * [Rendering Features](Main#rendering-features)
    * [Interface Patterns](Main#interface-patterns)
* [Workspaces](Workspaces)
    * [Creating](Workspaces#creating)
    * [Deleting](Workspaces#deleting)
    * [Listing](Workspaces#listing)
    * [Advanced Topics](Workspaces#advanced)
* [Discovering Graphs](Discovering-Graphs)
    * [Patching](Discovering-Graphs#patching)
    * [Metadata Scanning](Discovering-Graphs#scanning)
    * [Directed Discovery](Discovering-Graphs#directed)
    * [Inline Discovery](Discovering-Graphs#inline)
* [Filtering](Filtering)
* [Rendering](Rendering/Main)
* [Graph Calculations and Composition](Graph-Composition)
* [Metadata Operations](Metadata)

<a id="basic-features"></a>
## Basic Features

- Dependency graph discovery
- Filtered views during graph discovery and traversal
- Graph composition using addition/subtraction of multiple GAV+filter sub-graphs
- Workspaces to separate graphing activities and improve performance
- Metadata-scanning API that currently scans for SCM locations and license information per POM

<a id="rendering-features"></a>
## Rendering Features

- mapping of files to repository base-URL by GAV
- list of 'Downloading...' lines to mimic Maven console output
- modified `dependency:tree` style output that also shows relevant parent POMs
- Graphviz DOT file
- repository .zip archive
- Bill-of-Materials POM
- JSON dump of graph relationships
- collation of GAVs by metadata values

<a id="interface-patterns"></a>
## Interface Patterns

Most depgraph services are provided via REST-ish endpoint that works in one of two ways:

- GET request with path and query parameters (path params are requirements, query params are optional)
- POST request with JSON configuration body that conveys complex service options

  [1]: https://github.com/jdcasey/cartographer
