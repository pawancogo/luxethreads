#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Read Node.js version from version files (similar to .nvmrc)
if [[ -f "$SCRIPT_DIR/.node-version" ]]; then
  REQUIRED_NODE="$(cat "$SCRIPT_DIR/.node-version" | tr -d '\n' | sed 's/^v//')"
elif [[ -f "$SCRIPT_DIR/.nvmrc" ]]; then
  REQUIRED_NODE="$(cat "$SCRIPT_DIR/.nvmrc" | tr -d '\n' | sed 's/^v//')"
else
  REQUIRED_NODE="22.12.0"
  echo "${REQUIRED_NODE}" > "$SCRIPT_DIR/.node-version"
fi

log() {
  printf '\n[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

error() {
  printf '\nERROR: %s\n' "$*" 1>&2
  exit 1
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

compare_versions() {
  # Returns 0 (true) when $1 >= $2, otherwise 1 (false)
  local IFS=.
  local -a v1=($1) v2=($2)
  local i len diff
  len=${#v1[@]}
  if [ ${#v2[@]} -gt $len ]; then
    len=${#v2[@]}
  fi
  for ((i=0; i<len; i++)); do
    local num1=${v1[i]:-0}
    local num2=${v2[i]:-0}
    if ((10#$num1 > 10#$num2)); then
      return 0
    fi
    if ((10#$num1 < 10#$num2)); then
      return 1
    fi
  done
  return 0
}

ensure_node_version() {
  log "Checking Node.js version (project-local only)"
  
  # Check if .node-version or .nvmrc exists
  local node_version_file=""
  if [[ -f "$SCRIPT_DIR/.node-version" ]]; then
    node_version_file=".node-version"
  elif [[ -f "$SCRIPT_DIR/.nvmrc" ]]; then
    node_version_file=".nvmrc"
  fi
  
  local project_node="${REQUIRED_NODE}"
  if [[ -n "$node_version_file" ]]; then
    project_node="$(cat "$SCRIPT_DIR/$node_version_file" | tr -d '\n' | sed 's/^v//')"
    log "Found ${node_version_file}: ${project_node} (using project-specified version)"
    
    # Warn if version doesn't meet requirement but don't overwrite
    if ! compare_versions "$project_node" "$REQUIRED_NODE"; then
      log "Warning: ${node_version_file} specifies ${project_node}, but ${REQUIRED_NODE}+ is recommended."
      log "Continuing with project-specified version ${project_node}..."
    fi
  else
    # Create .node-version if it doesn't exist
    echo "${REQUIRED_NODE}" > "$SCRIPT_DIR/.node-version"
    log "Created .node-version with ${REQUIRED_NODE}"
  fi
  
  # Try to use nvm (project-local)
  if [[ -s "$HOME/.nvm/nvm.sh" ]] || command_exists nvm; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    if ! nvm list "${project_node}" 2>/dev/null | grep -q "v${project_node}"; then
      log "Installing Node.js ${project_node} (project-local via nvm)..."
      nvm install "${project_node}" || error "Failed to install Node.js ${project_node}"
    fi
    
    # Use local version (project-level only)
    nvm use "${project_node}" 2>/dev/null || nvm alias default "${project_node}" 2>/dev/null || true
    
    local node_version
    node_version="$(node --version | sed 's/^v//' 2>/dev/null || echo '0.0.0')"
    
    if compare_versions "$node_version" "$project_node"; then
      log "Node.js version check passed: ${node_version} (project-local)"
    else
      error "Node.js ${project_node} required, found ${node_version}. Please install it manually: nvm install ${project_node}"
    fi
    return
  fi
  
  # Try asdf (project-local)
  if command_exists asdf || [[ -d "$HOME/.asdf" ]]; then
    . "$HOME/.asdf/asdf.sh" 2>/dev/null || true
    
    if ! asdf list nodejs 2>/dev/null | grep -q "${project_node}"; then
      log "Installing Node.js ${project_node} (project-local via asdf)..."
      asdf plugin add nodejs 2>/dev/null || true
      asdf install nodejs "${project_node}" || error "Failed to install Node.js ${project_node}"
    fi
    
    # Set local version (project-level only)
    if [[ -f "$SCRIPT_DIR/.tool-versions" ]]; then
      if ! grep -q "nodejs" "$SCRIPT_DIR/.tool-versions"; then
        echo "nodejs ${project_node}" >> "$SCRIPT_DIR/.tool-versions"
      fi
    else
      echo "nodejs ${project_node}" > "$SCRIPT_DIR/.tool-versions"
    fi
    asdf reshim nodejs 2>/dev/null || true
    
    local node_version
    node_version="$(node --version | sed 's/^v//' 2>/dev/null || echo '0.0.0')"
    
    if compare_versions "$node_version" "$project_node"; then
      log "Node.js version check passed: ${node_version} (project-local)"
    else
      error "Node.js ${project_node} required, found ${node_version}. Please install it manually: asdf install nodejs ${project_node}"
    fi
    return
  fi
  
  # Fallback: check if Node.js is available and matches
  if command_exists node; then
    local node_version
    node_version="$(node --version | sed 's/^v//' 2>/dev/null || echo '0.0.0')"
    
    if compare_versions "$node_version" "$project_node"; then
      log "Node.js version check passed: ${node_version}"
      log "Note: Consider using nvm or asdf for project-local Node.js management"
    else
      error "Node.js ${project_node}+ required, found ${node_version}. Please install it manually."
    fi
  else
    error "Node.js is required. Please install Node.js ${project_node} using nvm or asdf for project-local management."
  fi
}

ensure_prerequisites() {
  log "Checking prerequisites (project-local only)"
  
  # Check git
  if ! command_exists git; then
    error "git is required. Install it via https://git-scm.com/downloads"
  fi
  
  # Check and setup Node.js (project-local)
  ensure_node_version
  
  # Verify Node.js is available
  if ! command_exists node; then
    error "Node.js installation failed. Please install Node.js ${REQUIRED_NODE} manually."
  fi
  
  # Check npm (comes with Node.js)
  if ! command_exists npm; then
    error "npm is required (should come with Node.js). Please reinstall Node.js."
  fi
  log "npm check passed"
  
  log "All prerequisites checked (project-local)"
}

setup_frontend() {
  log "Setting up luxethreads frontend (Vite + React)"
  pushd "$SCRIPT_DIR" >/dev/null
  
  # Install dependencies (project-local)
  log "Installing npm dependencies..."
  npm install || error "Failed to install npm dependencies"
  
  popd >/dev/null
  log "Frontend setup complete"
}

main() {
  log "Starting frontend setup (project-local configuration only)"
  ensure_prerequisites
  setup_frontend
  log "Setup complete! All configurations are project-local."
}

main "$@"

