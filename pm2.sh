#!/bin/bash

APP_NAME_UNFORMATTED="Jungle Status Site"
APP_NAME="jungle-status-site"
DEFAULT_PORT=32915
PORT=${1:-$DEFAULT_PORT}

echo "Starting $APP_NAME_UNFORMATTED on port $PORT"

npm run build

export PORT=$PORT

pm2 delete doubloon-leaderboard
pm2 start index.js --name "$APP_NAME"
pm2 save

echo "Running on port $PORT"
