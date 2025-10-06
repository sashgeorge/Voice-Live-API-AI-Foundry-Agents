# Start Azure Voice Live API Web UI
Write-Host "Starting Azure Voice Live API Web UI..." -ForegroundColor Cyan
Write-Host ""

# Activate virtual environment
& .\myenv\Scripts\Activate.ps1

# Start Flask server
python app.py
