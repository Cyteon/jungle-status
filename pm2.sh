#!/bin/bash

APP_NAME_UNFORMATTED="Jungle Status Site"
APP_NAME="jungle-status-site"
DEFAULT_PORT=32915
PORT=${1:-$DEFAULT_PORT}

echo "Starting $APP_NAME_UNFORMATTED on port $PORT"

export PORT=$PORT

pm2 delete "$APP_NAME"
pm2 start index.js --name "$APP_NAME"
pm2 save

echo "Running on port $PORT"
