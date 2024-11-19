# Orakel

> brainstorm with llama/anything

**The project is under active refactoring and rapid development. Expect breakages and
un-documented behaviors and stale documentations/guides.**

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

### Type-Safety

We have decided to use JSDoc to document the types and Typescript to enforce it
at runtime. `tsconfig.json` in the root directory is typical setup.

Install typescript transpiler as dev-dependency :

```bash
pnpm add -D typescript` #if using pnpm (desired)
npm install -D typescript #if using npm
```

Now your editor/IDE should provide warnings and errors if you misuse the constructs.

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

### State

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

} }

---

Built in B4Y3RW4LD Hackathon.
