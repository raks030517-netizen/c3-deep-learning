@echo off
title AI ORBIT OS v4
echo AI ORBIT OS v4 starting...
if not exist node_modules (
  echo Installing dependencies...
  npm install
)
npm run dev
pause
