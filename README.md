# Orakel

> brainstorm with llama/anything

### Configuration

> run `configure-de.sh` to configure new POSIX systems. Keep on reading to
> find more options.

By default the app runs in production mode. Configure the app with `.env`
file in the same directory level as `app.py`. The file should [stricly] follow the schema of:

```text
KEY=VALUE
```

example:

```text
PORT=5005
DEBUG=1
HOST=0.0.0.0
MODEL=None
```

_if your computer is not powerful enough for a local lanaugage model just do `MODEL=None`
if you put nothing it will be `MODEL=llama3.1`_

> at this commit the env parsing doesn't allow variables inside the values

### Running

run in development with `python3 app.py`

> [!danger] this server is only for development.

### Stack

- frontend: vanillajs, Yes! we raw-dogged it :P
- backend: flask and ollama library

### Stack

features working

grab nodes
lines updating
deleting single nodes
double click to add to context and remove with ui
multiselect with shift and multi delete

not working:
multi grab

todo

---

Built in B4Y3RW4LD Hackathon.

We might use json like:

{
"graph": {
"nodes": {
"nodeID1" : {

        "x": 1,
        "y": 1,
        "text": "Alice"
      },
      "nodeID2":{
       "x": 1,
        "y": 1,
        "text": "Bob"
      }
    },
    "edges": [["nodeID1","nodeID2","parent"]]

}
}
