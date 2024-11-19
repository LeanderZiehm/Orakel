---
title: Input Interface
description: input interfaces found in Orakel
---

## Members

<dl>
<dt><a href="#draggedNode">draggedNode</a> : <code>OrakelNode</code> | <code>null</code></dt>
<dd></dd>
<dt><a href="#clickedBackgroundPosition">clickedBackgroundPosition</a> : <code>Position</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#promptTxtBox">promptTxtBox</a> : <code>HTMLInputElement</code> | <code>null</code></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#singleSelect">singleSelect(node)</a></dt>
<dd></dd>
<dt><a href="#multiSelect">multiSelect(node)</a></dt>
<dd></dd>
<dt><a href="#subscribeNodeEvents">subscribeNodeEvents(node)</a></dt>
<dd><p>attaches required events to the new node.  following events are subscribed:
    - toggling context state when <em>double clicked</em>
    - multiselect when <em>clicked</em> <strong>and</strong> holding <em>shift</em>
    - drag trigger when <em>clicked on</em> wwithout holding <em>strl</em> or <em>shift</em></p>
</dd>
<dt><a href="#keydownHandler">keydownHandler(event)</a> ⇒ <code>void</code></dt>
<dd><p>toggles flags which indeicates the pressed keys if any of the meta keys were
pressed. also triggers delete functionality if delete key-sequence is pressed.</p>
</dd>
<dt><a href="#pointerdownHandler">pointerdownHandler(event)</a></dt>
<dd></dd>
<dt><a href="#keyupHandler">keyupHandler(event)</a></dt>
<dd></dd>
<dt><a href="#startDrag">startDrag(event, node)</a></dt>
<dd></dd>
<dt><a href="#stopDrag">stopDrag()</a></dt>
<dd></dd>
<dt><a href="#onDrag">onDrag(event)</a> ⇒ <code>void</code></dt>
<dd></dd>
</dl>

<a name="draggedNode"></a>

## draggedNode : <code>OrakelNode</code> \| <code>null</code>

**Kind**: global variable  
<a name="clickedBackgroundPosition"></a>

## clickedBackgroundPosition : <code>Position</code>

**Kind**: global variable  
<a name="promptTxtBox"></a>

## promptTxtBox : <code>HTMLInputElement</code> \| <code>null</code>

**Kind**: global constant  
<a name="singleSelect"></a>

## singleSelect(node)

**Kind**: global function  
**Summary**: selects a single node

| Param | Type                    |
| ----- | ----------------------- |
| node  | <code>OrakelNode</code> |

<a name="multiSelect"></a>

## multiSelect(node)

**Kind**: global function  
**Summary**: selects multiple nodes

| Param | Type                    |
| ----- | ----------------------- |
| node  | <code>OrakelNode</code> |

<a name="subscribeNodeEvents"></a>

## subscribeNodeEvents(node)

attaches required events to the new node. following events are subscribed: - toggling context state when _double clicked_ - multiselect when _clicked_ **and** holding _shift_ - drag trigger when _clicked on_ wwithout holding _strl_ or _shift_

**Kind**: global function  
**Summary**: subscribes to neccessary events of the node

| Param | Type                        | Description      |
| ----- | --------------------------- | ---------------- |
| node  | <code>HTMLDivElement</code> | node in question |

<a name="keydownHandler"></a>

## keydownHandler(event) ⇒ <code>void</code>

toggles flags which indeicates the pressed keys if any of the meta keys were
pressed. also triggers delete functionality if delete key-sequence is pressed.

**Kind**: global function  
**Summary**: toggles flag/triggers functions according to the key pressed by the user

| Param | Type                       | Description                |
| ----- | -------------------------- | -------------------------- |
| event | <code>KeyboardEvent</code> | event given by the browser |

<a name="pointerdownHandler"></a>

## pointerdownHandler(event)

**Kind**: global function  
**Summary**: toggles active state/drags the node

| Param | Type                      | Description                       |
| ----- | ------------------------- | --------------------------------- |
| event | <code>PointerEvent</code> | event object given by the browser |

<a name="keyupHandler"></a>

## keyupHandler(event)

**Kind**: global function  
**Summary**: disables the flag according to the modifier key pressed

| Param | Type                       |
| ----- | -------------------------- |
| event | <code>KeyboardEvent</code> |

<a name="startDrag"></a>

## startDrag(event, node)

**Kind**: global function  
**Summary**: sets up the environment for the drag handler to work

| Param | Type                      | Description                        |
| ----- | ------------------------- | ---------------------------------- |
| event | <code>PointerEvent</code> |                                    |
| node  | <code>OrakelNode</code>   | node the user has selected to drag |

<a name="stopDrag"></a>

## stopDrag()

**Kind**: global function  
**Summary**: resets the environment when a drag is finished  
<a name="onDrag"></a>

## onDrag(event) ⇒ <code>void</code>

**Kind**: global function  
**Summary**: drags the selected node(s) along with user's pointer movement

| Param | Type                      |
| ----- | ------------------------- |
| event | <code>PointerEvent</code> |
