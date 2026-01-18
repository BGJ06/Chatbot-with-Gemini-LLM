@echo off
echo Starting WhatsApp Gemini Chatbot...

:: Start Backend in a new window
start "Backend Server" cmd /k "cd backend && npm start"

:: Start Frontend in a new window
start "Frontend Client" cmd /k "cd frontend && npm run dev"

:: Start Tunnel (for WhatsApp)
start "Public Tunnel" cmd /k "npx -y localtunnel --port 5000"

echo.
echo Application started!
echo Backend: Check the "Backend Server" window for "Server running..."
echo Frontend: Check the "Frontend Client" window for the URL (e.g. http://localhost:5173)
echo.
pause
