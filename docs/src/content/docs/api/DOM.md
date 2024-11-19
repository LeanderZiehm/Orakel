---
title: DOM
description: all the functions that work with DOM
---

## Members

<dl>
<dt><a href="#uid">uid</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#CREATE_LINES_FOR_CONTEXT_NODES">CREATE_LINES_FOR_CONTEXT_NODES</a> : <code>boolean</code></dt>
<dd></dd>
<dt><a href="#NODE_OFFSET_Y">NODE_OFFSET_Y</a> : <code>number</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#createUserNode">createUserNode(text)</a></dt>
<dd></dd>
<dt><a href="#createLLMNodes">createLLMNodes(texts)</a></dt>
<dd></dd>
<dt><a href="#getNodePosition">getNodePosition(node)</a> ⇒ <code>Position</code></dt>
<dd></dd>
<dt><a href="#setNodePosition">setNodePosition(node, x, y)</a></dt>
<dd></dd>
<dt><a href="#getNewNode">getNewNode(text, createdByLLM)</a> ⇒ <code>OrakelNode</code> | <code>HTMLDivElement</code></dt>
<dd></dd>
<dt><a href="#reconstructContextList">reconstructContextList()</a></dt>
<dd></dd>
<dt><a href="#removeNodeFromMemory">removeNodeFromMemory(node)</a></dt>
<dd></dd>
<dt><a href="#toggleContext">toggleContext(node)</a></dt>
<dd></dd>
<dt><a href="#addToContext">addToContext(node)</a></dt>
<dd></dd>
<dt><a href="#getReferencePosition">getReferencePosition()</a> ⇒ <code>Position</code></dt>
<dd></dd>
<dt><a href="#createLine">createLine(lineContainer, node1, node2)</a></dt>
<dd></dd>
<dt><a href="#createLines">createLines(node)</a></dt>
<dd><p>creates (draws) line from given <code>node</code> to its associated
notes using cartesian plane trigonometry (2D). Uses the relationship
established previously with the type <a href="OrakelLine">OrakelLine</a></p>
</dd>
<dt><a href="#createLineWithParent">createLineWithParent(parentNode, childNode, isCreatedByUser)</a></dt>
<dd></dd>
<dt><a href="#createArrow">createArrow(line, base_left, base_top)</a></dt>
<dd></dd>
<dt><a href="#createLineFromAToB">createLineFromAToB(A, B)</a> ⇒ <code>OrakelLineMeta</code></dt>
<dd></dd>
</dl>

<a name="uid"></a>

## uid

**Kind**: global variable  
<a name="CREATE_LINES_FOR_CONTEXT_NODES"></a>

## CREATE_LINES_FOR_CONTEXT_NODES : <code>boolean</code>

**Kind**: global constant  
<a name="NODE_OFFSET_Y"></a>

## NODE_OFFSET_Y : <code>number</code>

**Kind**: global constant  
<a name="createUserNode"></a>

## createUserNode(text)

**Kind**: global function  
**Summary**: creates an [OrakelNode](OrakelNode) with attributes for user created nodes

| Param | Type                | Description         |
| ----- | ------------------- | ------------------- |
| text  | <code>string</code> | content of the node |

<a name="createLLMNodes"></a>

## createLLMNodes(texts)

**Kind**: global function

| Param | Type                              | Description                                  |
| ----- | --------------------------------- | -------------------------------------------- |
| texts | <code>Array.&lt;string&gt;</code> | text that needs to be made as node's content |

<a name="createLLMNodes..createdNodes"></a>

### createLLMNodes~createdNodes : <code>Array.&lt;OrakelNode&gt;</code>

**Kind**: inner constant of [<code>createLLMNodes</code>](#createLLMNodes)  
<a name="getNodePosition"></a>

## getNodePosition(node) ⇒ <code>Position</code>

**Kind**: global function  
**Summary**: computes the position of a node in x coordinate if
top-left of the screen is (0,0) [origin]

| Param | Type                    | Description               |
| ----- | ----------------------- | ------------------------- |
| node  | <code>OrakelNode</code> | inquiring node's position |

<a name="setNodePosition"></a>

## setNodePosition(node, x, y)

**Kind**: global function  
**Summary**: sets the `node` position and updates the lines attached

| Param | Type                    | Description                            |
| ----- | ----------------------- | -------------------------------------- |
| node  | <code>OrakelNode</code> | node whose position needs to be set    |
| x     | <code>number</code>     | x position if top-left corner is (0,0) |
| y     | <code>number</code>     | y position if top-left corner is (0,0) |

<a name="getNewNode"></a>

## getNewNode(text, createdByLLM) ⇒ <code>OrakelNode</code> \| <code>HTMLDivElement</code>

**Kind**: global function  
**Summary**: creates a div node with included text content and proper
styling depending on who created the node  
**Todo**

- [ ] write test
- [ ] refactor param createByLLM

| Param        | Type                 | Default            | Description                           |
| ------------ | -------------------- | ------------------ | ------------------------------------- |
| text         | <code>string</code>  |                    | new node's text content               |
| createdByLLM | <code>boolean</code> | <code>false</code> | flag to indicate who created the node |

<a name="reconstructContextList"></a>

## reconstructContextList()

**Kind**: global function  
**Summary**: reconstructs (reset and render anew) context map [on top-left corner]  
**Todo**

- [ ] write test

<a name="removeNodeFromMemory"></a>

## removeNodeFromMemory(node)

**Kind**: global function  
**Summary**: removes specified node from the context map on top-left corner

| Param | Type                    | Description                   |
| ----- | ----------------------- | ----------------------------- |
| node  | <code>OrakelNode</code> | node that needs to be removed |

<a name="toggleContext"></a>

## toggleContext(node)

**Kind**: global function  
**Summary**: toggles a node's contextual-state

| Param | Type                    | Description                                   |
| ----- | ----------------------- | --------------------------------------------- |
| node  | <code>OrakelNode</code> | node whose contextual-state should be toggles |

<a name="addToContext"></a>

## addToContext(node)

**Kind**: global function  
**Summary**: appends given `node` to the context map and [reconstructContextList](#reconstructContextList)
re-renders the context map

| Param | Type                    | Description                                     |
| ----- | ----------------------- | ----------------------------------------------- |
| node  | <code>OrakelNode</code> | node whoch needs to be added to the context map |

<a name="getReferencePosition"></a>

## getReferencePosition() ⇒ <code>Position</code>

**Kind**: global function  
**Summary**: computes starting coordinates of next new node
using either active Nodes or last creation node. consider
top-left corner of the screen as (0,0) [origin] for the plane  
<a name="getReferencePosition..pos"></a>

### getReferencePosition~pos : <code>Position</code>

**Kind**: inner property of [<code>getReferencePosition</code>](#getReferencePosition)  
<a name="createLine"></a>

## createLine(lineContainer, node1, node2)

**Kind**: global function  
**Summary**: creates a directed line from `node1` to `node2`

| Param         | Type                    | Description            |
| ------------- | ----------------------- | ---------------------- |
| lineContainer | <code>OrakelLine</code> |                        |
| node1         | <code>OrakelNode</code> | start node of the line |
| node2         | <code>OrakelNode</code> | end of the line        |

<a name="createLines"></a>

## createLines(node)

creates (draws) line from given `node` to its associated
notes using cartesian plane trigonometry (2D). Uses the relationship
established previously with the type [OrakelLine](OrakelLine)

**Kind**: global function  
**Summary**: draws line between node and its associated nodes  
**Todo**

- [ ] write test

| Param | Type                    | Description                         |
| ----- | ----------------------- | ----------------------------------- |
| node  | <code>OrakelNode</code> | node to which lines are to be drawn |

<a name="createLineWithParent"></a>

## createLineWithParent(parentNode, childNode, isCreatedByUser)

**Kind**: global function  
**Summary**: creates line from child to parent attaching metadata as well

| Param           | Type                    | Default            | Description                       |
| --------------- | ----------------------- | ------------------ | --------------------------------- |
| parentNode      | <code>OrakelNode</code> |                    | node which will act like a parent |
| childNode       | <code>OrakelNode</code> |                    | node which will act like a child  |
| isCreatedByUser | <code>boolean</code>    | <code>false</code> | flag to indicate the ownership    |

<a name="createArrow"></a>

## createArrow(line, base_left, base_top)

**Kind**: global function  
**Summary**: draws an arrow at the given position using `base_left` and `base_right`

| Param     | Type                    | Description                       |
| --------- | ----------------------- | --------------------------------- |
| line      | <code>OrakelLine</code> | line that needs to have the arrow |
| base_left | <code>number</code>     | position of arrow in x axis       |
| base_top  | <code>number</code>     | position of the arrow in y axis   |

<a name="createLineFromAToB"></a>

## createLineFromAToB(A, B) ⇒ <code>OrakelLineMeta</code>

**Kind**: global function  
**Summary**: computes the metadata need to draw a line from `A` to `B` in a 2D plane

| Param | Type                    | Description           |
| ----- | ----------------------- | --------------------- |
| A     | <code>OrakelNode</code> | one end of the line   |
| B     | <code>OrakelNode</code> | other end of the line |
