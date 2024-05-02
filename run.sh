#!/bin/bash

cd mybank-frontend || return
echo "Starting frontend"

npm start &

cd ../mybank-backend || return
echo "Starting backend"
npm start
