let edges = []
let nodes = []
for (let i = 0; i < 5; i++) {
    nodes.push({ data: { id: i, text: i } });
}
edges.push({ data: { id: '0->4', weight: 1, source: '0', target: '4' } });
edges.push({ data: { id: '0->1', weight: 3, source: '0', target: '1' } });
edges.push({ data: { id: '1->4', weight: 4, source: '1', target: '4' } });
edges.push({ data: { id: '1->2', weight: 5, source: '1', target: '2' } });
edges.push({ data: { id: '2->4', weight: 6, source: '2', target: '4' } });
edges.push({ data: { id: '2->3', weight: 2, source: '2', target: '3' } });
edges.push({ data: { id: '4->3', weight: 7, source: '4', target: '3' } });
var cy = cytoscape({
    container: document.getElementById('cy'),

    elements: {
        nodes: [
            { data: { id: '0', text: '0' } },
            { data: { id: '1', text: '1' } },
            { data: { id: '2', text: '2' } },
            { data: { id: '3', text: '3' } },
            { data: { id: '4', text: '4' } }
        ],

        edges: [
            { data: { id: '0->4', weight: 1, source: '0', target: '4' } },
            { data: { id: '0->1', weight: 3, source: '0', target: '1' } },
            { data: { id: '1->4', weight: 4, source: '1', target: '4' } },
            { data: { id: '1->2', weight: 5, source: '1', target: '2' } },
            { data: { id: '2->4', weight: 6, source: '2', target: '4' } },
            { data: { id: '2->3', weight: 2, source: '2', target: '3' } },
            { data: { id: '4->3', weight: 7, source: '4', target: '3' } }
        ]
    },

    style: [{
            selector: "node",
            style: {
                width: 20,
                "background-color": "#666",
                label: "data(id)",
                "font-size": "13px",
                "text-valign": "center",
                "background-color": "#555",
                "text-outline-width": "1px",
                color: "#fff",
            }
        },

        {
            selector: "edge",
            style: {
                width: 3,
                "line-color": "red",
                "target-arrow-color": "blue",
                "target-arrow-shape": "triangle",
                "curve-style": "bezier",
                label: "data(weight)",
                "font-size": "14px"
            }
        },
        {
            selector: ".highlighted",
            style: {
                "background-color": "purple",
                "line-color": "Green",
                "target-arrow-color": "yellow",
                "transition-property": "background-color, line-color, target-arrow-color",
                "transition-duration": "0.5s"
            }
        },

    ],

    layout: {
        name: "cose",
        rows: 3,
        directed: true,
        padding: 10
    }
});


function Addnodes() {
    cy.elements().remove();
    let N = document.querySelector("#numVert").value;
    if (N === "") {
        N = 3;
    }

    console.log("Generating a graph of ", N, " vertices");
    nodes = [];
    edges = [];
    for (var i = 0; i < N; i++) {
        nodes.push({ group: "nodes", data: { id: i, text: i } });
    }

    cy.add(nodes);
    cy.layout({ name: "cose" }).run();
}

function Addedge() {
    let edgeFrom = document.getElementById("src_edge").value;
    let edgeTo = document.getElementById("trg_edge").value;
    let edgeWeight = document.getElementById("weight").value;
    edges.push({
        group: "edges",
        data: {
            id: `${edgeFrom}->${edgeTo}`,
            source: `${edgeFrom}`,
            target: `${edgeTo}`,
            position: { x: 100, y: 100 },
            weight: `${edgeWeight}`
        }
    });
    cy.add(edges);
    cy.layout({ name: "cose" }).run();
    document.getElementById("src_edge").value = null;
    document.getElementById("trg_edge").value = null;
    document.getElementById("weight").value = null;
}

function remove() {
    let id = document.querySelector("#ID").value;
    cy.remove(cy.getElementById(id));
    cy.layout({ name: "cose" }).run();
    document.getElementById("ID").value = null;
}

function runAlgorithm() {
    const algo = document.getElementById("Algorithms").value;
    cy.elements().removeClass("highlighted");


    let startVertex = (document.getElementById("startIndex").value !== "") ? document.getElementById("startIndex").value : "0";

    console.log("Starting vertex is: ", startVertex)


    if (algo === "BFS") {
        var bfs = dobfs(startVertex);
        var i = 0;
        var highlightNextEle = function() {
            if (i < bfs.length) {
                cy.getElementById(bfs[i]).addClass("highlighted");

                i++;
                setTimeout(highlightNextEle, 1000);
            }
        };
        highlightNextEle();

    } else if (algo === "DFS") {
        var dfs = dodfs(startVertex);
        // var bfs = dobfs(startVertex);
        var i = 0;
        var highlightNextEle = function() {
            if (i < dfs.length) {
                cy.getElementById(dfs[i]).addClass("highlighted");

                i++;
                setTimeout(highlightNextEle, 1000);
            }
        };
        highlightNextEle();
    }
}

function dobfs(startVertex) {
    let adjencylist = [];
    let visited = [];
    nodes.forEach(node => {
        adjencylist[node.data.id] = [];
        visited[node.data.id] = false;
    })

    edges.forEach(edge => {
        adjencylist[edge.data.source].push(edge.data.target);
    })
    let seq = [];
    var Queue = new queue();
    Queue.enqueue(startVertex);
    seq.push(`${startVertex}`);
    visited[startVertex] = true;
    while (!Queue.isEmpty()) {
        var s = Queue.front();
        Queue.dequeue();
        if (visited[s] == true) {
            for (let i = 0; i < adjencylist[s].length; i++) {
                if (visited[adjencylist[s][i]] != true) {
                    Queue.enqueue(adjencylist[s][i]);
                    seq.push(`${s}->${adjencylist[s][i]}`);
                    seq.push(`${adjencylist[s][i]}`);
                    visited[adjencylist[s][i]] = true;
                    // break;
                }

            }
        }
        // visited[s] = true;
    }
    return seq;
}

function dodfs(startVertex) {
    let adjencylist = [];
    let visited = [];
    nodes.forEach(node => {
        adjencylist[node.data.id] = [];
        visited[node.data.id] = false;
    })

    edges.forEach(edge => {
        adjencylist[edge.data.source].push(edge.data.target);
    })
    let seq = [];
    var Stack = new stack();
    Stack.push(startVertex);
    seq.push(`${startVertex}`);
    visited[startVertex] = true;
    while (!Stack.isEmpty()) {
        var s = Stack.top();
        // Stack.pop();
        var num = 0;
        for (let i = 0; i < adjencylist[s].length; i++) {
            if (visited[adjencylist[s][i]] != true) {
                Stack.push(adjencylist[s][i]);
                seq.push(`${s}->${adjencylist[s][i]}`);
                seq.push(`${adjencylist[s][i]}`);
                visited[adjencylist[s][i]] = true;
                break;
            } else {
                num++;
            }
        }
        if (num == adjencylist[s].length) {
            Stack.pop();
        }
    }
    return seq;
}


// function dobfs(startVertex) {
//     var bfs = cy.elements().bfs("#" + startVertex, function() {}, true);

//     var i = 0;
//     var highlightNextEle = function() {
//         if (i < bfs.path.length) {
//             bfs.path[i].addClass('highlighted');

//             i++;
//             setTimeout(highlightNextEle, 1000);
//         }
//     };
//     highlightNextEle();

// }

// function doDFS(startVertex) {
//     var dfs = cy.elements().dfs("#" + startVertex, function() {}, true);

//     var i = 0;
//     var highlightNextEle = function() {
//         if (i < dfs.path.length) {
//             dfs.path[i].addClass('highlighted');

//             i++;
//             setTimeout(highlightNextEle, 1000);
//         }
//     };
//     highlightNextEle();

// }