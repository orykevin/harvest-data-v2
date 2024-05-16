@echo off

echo Starting Node.js server
cd server
start cmd /k "bun run dev"

cd ..

echo Starting React development server 
cd app
start cmd /k "bun run dev"

cd ..

