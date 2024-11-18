#!/usr/bin/env bash

# installs nvm; from: https://nodejs.org/en/download/package-manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# installs pnpm; from: https://pnpm.io/installation
curl -fsSL https://get.pnpm.io/install.sh | sh -

# bootstrap nodejs env
pnpm install

# bootstrap python env
pip3 install -r ./requirements.txt

# create server .env file
cp .env.example .env