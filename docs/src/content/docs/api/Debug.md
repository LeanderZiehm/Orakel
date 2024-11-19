---
title: Debug Utility
description: debug interfaces found in Orakel 
---
## Members

<dl>
<dt><a href="#debugContainer">debugContainer</a> : <code>HTMLDivElement</code></dt>
<dd></dd>
<dt><a href="#debugContainer">debugContainer</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#debug">debug(input)</a></dt>
<dd><p>prints the <code>input</code> param to the debug window on top-right corner of the page</p>
</dd>
<dt><a href="#insertCSS">insertCSS()</a> ⇒ <code>void</code></dt>
<dd></dd>
<dt><a href="#insertHTML">insertHTML()</a> ⇒ <code>HTMLDivElement</code></dt>
<dd></dd>
</dl>

<a name="debugContainer"></a>

## debugContainer : <code>HTMLDivElement</code>
**Kind**: global variable  
<a name="debugContainer"></a>

## debugContainer
**Kind**: global variable  
<a name="debug"></a>

## debug(input)
prints the `input` param to the debug window on top-right corner of the page

**Kind**: global function  
**Todo**

- [ ] write test


| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> \| <code>Object</code> \| <code>Array.&lt;T&gt;</code> | string that needs to be print to the debug aread |

<a name="insertCSS"></a>

## insertCSS() ⇒ <code>void</code>
**Kind**: global function  
**Summary**: creates a style tag and add it to the body. this style tag
is these used to style the [debugContainer](#debugContainer)  
<a name="insertHTML"></a>

## insertHTML() ⇒ <code>HTMLDivElement</code>
**Kind**: global function  
**Summary**: creates a div node in DOM for debugging purposes
this div is used as an container to be able to log
debug messages without needing to open up console  
