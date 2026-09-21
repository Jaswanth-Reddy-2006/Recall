# Recall AI Server Setup Script — Windows PowerShell
# Usage: .\scripts\setup-ai.ps1
# Requires: Ollama installed (https://ollama.com/download)
#
# This script:
#   1. Checks that Ollama is installed
#   2. Checks that Ollama is running (does NOT auto-start — it may need GPU init)
#   3. Pulls required models only if they are missing
#   4. Verifies each model
#   5. Installs Python dependencies
#   6. Starts the AI server
#
# DO NOT run this script with Ollama already pulling models — wait for pulls to finish.

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  RECALL AI SERVER — Setup & Startup" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Check Ollama is installed ────────────────────────────────────────
Write-Host "[1/6] Checking Ollama installation..." -ForegroundColor Yellow
try {
    $ollamaVersion = (ollama --version 2>&1) | Select-String -Pattern "\d+\.\d+\.\d+" | ForEach-Object { $_.Matches[0].Value }
    Write-Host "  ✓ Ollama found (version $ollamaVersion)" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Ollama not found in PATH." -ForegroundColor Red
    Write-Host "  Install Ollama from: https://ollama.com/download" -ForegroundColor Red
    exit 1
}

# ── Step 2: Check Ollama is running ──────────────────────────────────────────
Write-Host ""
Write-Host "[2/6] Checking Ollama server..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:11434/" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  ✓ Ollama server is running at http://localhost:11434" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Ollama server is NOT running." -ForegroundColor Red
    Write-Host ""
    Write-Host "  Please start Ollama:" -ForegroundColor Yellow
    Write-Host "    • Open the Ollama app from your Windows Start Menu" -ForegroundColor Yellow
    Write-Host "    • Or look for the Ollama icon in your system tray" -ForegroundColor Yellow
    Write-Host "    • Then re-run this script" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  NOTE: Ollama may fail to start if your GPU driver is not loaded." -ForegroundColor Yellow
    Write-Host "  In that case, start Ollama manually and wait for the tray icon to appear." -ForegroundColor Yellow
    exit 1
}

# ── Step 3: Pull required models if missing ───────────────────────────────────
Write-Host ""
Write-Host "[3/6] Checking required models..." -ForegroundColor Yellow

$requiredModels = @(
    @{ Name = "qwen3:8b";             Purpose = "Reasoning / extraction" },
    @{ Name = "qwen2.5vl:3b";         Purpose = "Vision / screenshot understanding" },
    @{ Name = "nomic-embed-text:v1.5"; Purpose = "Semantic embeddings" }
)

$installedRaw = ollama list 2>&1
$installedModels = $installedRaw | Where-Object { $_ -match "^\S" -and $_ -notmatch "^NAME" } |
    ForEach-Object { ($_ -split "\s+")[0] }

Write-Host "  Currently installed models:" -ForegroundColor DarkGray
$installedModels | ForEach-Object { Write-Host "    • $_" -ForegroundColor DarkGray }
Write-Host ""

foreach ($model in $requiredModels) {
    $modelName = $model.Name
    $isInstalled = $installedModels | Where-Object { $_ -eq $modelName -or $_ -like "$($modelName.Split(':')[0]):*" }

    if ($isInstalled) {
        Write-Host "  ✓ $modelName ($($model.Purpose)) — already installed" -ForegroundColor Green
    } else {
        Write-Host "  ↓ Pulling $modelName ($($model.Purpose))..." -ForegroundColor Yellow
        Write-Host "    This may take several minutes depending on your connection." -ForegroundColor DarkGray
        ollama pull $modelName
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  ✗ Failed to pull $modelName" -ForegroundColor Red
            exit 1
        }
        Write-Host "  ✓ $modelName pulled successfully" -ForegroundColor Green
    }
}

# ── Step 4: Verify each model ─────────────────────────────────────────────────
Write-Host ""
Write-Host "[4/6] Verifying models via Ollama API..." -ForegroundColor Yellow

foreach ($model in $requiredModels) {
    $modelName = $model.Name
    try {
        $tagsResponse = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 10
        $found = $tagsResponse.models | Where-Object { $_.name -eq $modelName -or $_.name -like "$($modelName.Split(':')[0]):*" }
        if ($found) {
            Write-Host "  ✓ $modelName verified" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $modelName not found in Ollama model list after pull" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ⚠ Could not verify $modelName via API: $_" -ForegroundColor Yellow
    }
}

# ── Step 5: Print LAN IP ──────────────────────────────────────────────────────
Write-Host ""
Write-Host "[5/6] Network configuration..." -ForegroundColor Yellow
$lanIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.InterfaceAlias -notmatch "Loopback" -and
    $_.IPAddress -notmatch "^169\." -and
    $_.IPAddress -notmatch "^127\."
} | Select-Object -First 1).IPAddress

if ($lanIp) {
    Write-Host "  Your LAN IP: $lanIp" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  For physical Android device:" -ForegroundColor Yellow
    Write-Host "    1. Connect your phone to the SAME Wi-Fi network as this laptop" -ForegroundColor Yellow
    Write-Host "    2. In Recall: Settings → AI Engine → Server URL" -ForegroundColor Yellow
    Write-Host "    3. Change to: http://$lanIp:8000" -ForegroundColor Yellow
    Write-Host "    4. Windows Firewall may block port 8000 — see README.md for the rule" -ForegroundColor Yellow
} else {
    Write-Host "  ⚠ Could not detect LAN IP. Check network settings if using a physical device." -ForegroundColor Yellow
}

# ── Step 6: Install Python dependencies and start AI server ──────────────────
Write-Host ""
Write-Host "[6/6] Installing Python dependencies and starting AI server..." -ForegroundColor Yellow

$aiServerDir = Join-Path $PSScriptRoot "..\ai-server"
$aiServerDir = Resolve-Path $aiServerDir

if (-not (Test-Path "$aiServerDir\.env")) {
    Write-Host "  Creating .env from .env.example..." -ForegroundColor DarkGray
    Copy-Item "$aiServerDir\.env.example" "$aiServerDir\.env"
    Write-Host "  ✓ .env created — edit ai-server/.env to customise settings" -ForegroundColor Green
}

Push-Location $aiServerDir
try {
    Write-Host "  Installing Python packages..." -ForegroundColor DarkGray
    py -m pip install -r requirements.txt --quiet
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ pip install failed" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ Dependencies installed" -ForegroundColor Green
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "  Starting Recall AI Server on http://0.0.0.0:8000" -ForegroundColor Cyan
    Write-Host "  Docs: http://localhost:8000/docs" -ForegroundColor Cyan
    Write-Host "  Health: http://localhost:8000/health" -ForegroundColor Cyan
    Write-Host "  Press Ctrl+C to stop" -ForegroundColor Cyan
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host ""
    py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
} finally {
    Pop-Location
}
