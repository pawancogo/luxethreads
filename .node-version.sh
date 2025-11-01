#!/bin/bash
# This script loads nvm and uses the version specified in .nvmrc
# Source this file in your shell: source .node-version.sh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Use the version specified in .nvmrc if it exists
if [ -f ".nvmrc" ]; then
  nvm use
fi
