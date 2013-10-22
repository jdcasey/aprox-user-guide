<!-- Freeki metadata. Do not remove this section!
TITLE: Workspaces
-->
<h1>Workspaces</h1>

<p>The depgraph add-on uses an artifact identity and artifact-relationship database API called <a href="https://github.com/jdcasey/atlas">Atlas</a>, which stores dependency graphs in databases that are each associated with a workspace. Separation by workspace allows different dependency graphs to be loaded and unloaded according to the needs of the requests being serviced. This saves memory on the server and improves overall system performance, while at the same time enabling users to explore different scenarios with different configurations in parallel without affecting one another.</p>

<h2>Creating a new workspace</h2>

<p>Currently, before you can start resolving a dependency graph you must first create a workspace. This can be done via a simple POST request to the <code>ws/new</code> resource:</p>

<pre class="prettyprint"><code class="language-bash">$ curl -i -X POST http://localhost:8080/aprox/api/1.0/depgraph/ws/new</code></pre>

<pre class="prettyprint"><code class="language-javascript">HTTP/1.1 201 Created
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
}</code></pre>

<p>The most important field in the returned JSON is the <code>id</code> field. This is your workspace identifier, and it’s used throughout the depgrapher REST services.</p>

<p><span style="sidenote"></span></p>

<h3>Deleting a workspace</h3>

<p>As you explore different configurations for your dependency graphs, occasionally you will want to delete old, obsolete dependency graphs. This is an easy operation; simply issue the following DELETE request (using your own workspace-id for the last part of the path):</p>

<pre class="prettyprint"><code class="language-bash">$ curl -i -X DELETE http://localhost:8080/aprox/api/1.0/depgraph/ws/1382474661713

HTTP/1.1 200 OK
Server: Apache-Coyote/1.1
Content-Length: 0
Date: Tue, 22 Oct 2013 20:49:49 GMT</code></pre>

<p></p>