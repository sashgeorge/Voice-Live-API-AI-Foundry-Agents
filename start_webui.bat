@echo off
echo Starting Azure Voice Live API Web UI...
echo.

REM Activate virtual environment
call myenv\Scripts\activate.bat

REM Start Flask server
python app.py

pause
