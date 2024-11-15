# Orakel

> brainstorm with llama/anything

### Configuration

By default the app runs in production mode. Configure the app with `.env`
file in the same directory level as `app.py`. The file should [stricly] follow the schema of:

```text
KEY=VALUE
```

example:

```text
PORT=5014
DEBUG=1
HOST=0.0.0.0
MODEL=None
```

> at this commit the env parsing doesn't allow variables inside the values

### Running

run in development with `python3 app.py`

> [!danger] this server is only for development.

### Stack

- frontend: vanillajs, Yes! we raw-dogged it :P
- backend: flask and ollama library

---

Built in Bayerwald Hackathon.
