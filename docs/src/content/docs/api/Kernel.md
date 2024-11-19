---
title: Kernel
description: Core logic of the project Orakel
---

## Functions

<dl>
<dt><a href="#createRequest">createRequest(message, [method])</a> ⇒ <code><a href="#RequestOptions">RequestOptions</a></code></dt>
<dd></dd>
<dt><a href="#sendToLLM">sendToLLM(nodeText, activeNodes, context)</a> ⇒ <code>void</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#RequestOptions">RequestOptions</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="createRequest"></a>

## createRequest(message, [method]) ⇒ [<code>RequestOptions</code>](#RequestOptions)

**Kind**: global function  
**Summary**: creates request with standardized schema  
**Returns**: [<code>RequestOptions</code>](#RequestOptions) - an Options object that can be passed to `fetch`

| Param    | Type                | Default                                     | Description                         |
| -------- | ------------------- | ------------------------------------------- | ----------------------------------- |
| message  | <code>Object</code> |                                             | object that needs to be send to api |
| [method] | <code>string</code> | <code>&quot;\&quot;POST\&quot;&quot;</code> | HTTP method that needs to be made   |

<a name="sendToLLM"></a>

## sendToLLM(nodeText, activeNodes, context) ⇒ <code>void</code>

**Kind**: global function  
**Summary**: Send the user prompt to the model along with context and the active nodes
and creates new nodes using [createLLMNodes](createLLMNodes)

| Param       | Type                                      | Description                    |
| ----------- | ----------------------------------------- | ------------------------------ |
| nodeText    | <code>string</code>                       | current prompt from the user   |
| activeNodes | <code>Array.&lt;HTMLDivElement&gt;</code> | nodes with the active state    |
| context     | <code>Array.&lt;HTMLDivElement&gt;</code> | nodes in the contextual memory |

<a name="sendToLLM..promptForLLM"></a>

### sendToLLM~promptForLLM : <code>string</code>

construct prompt for the backend. the schema is:
[ <each node content with csv> connected to <last element> ]

**Kind**: inner property of [<code>sendToLLM</code>](#sendToLLM)  
<a name="RequestOptions"></a>

## RequestOptions : <code>Object</code>

**Kind**: global typedef  
**Summary**: Standardized way to construct body
