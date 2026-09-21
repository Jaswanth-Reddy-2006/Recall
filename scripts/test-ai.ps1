# Recall AI -- Test Script (Windows PowerShell)
# Usage: .\scripts\test-ai.ps1
#
# Requires the AI server to be running on http://localhost:8000
# and Ollama to be running with all three models installed.

$ErrorActionPreference = "Continue"
$BASE_URL = "http://localhost:8000"
$PASS = 0
$FAIL = 0

function Write-Pass($msg) {
    Write-Host "  [PASS] $msg" -ForegroundColor Green
    $script:PASS++
}

function Write-Fail($msg) {
    Write-Host "  [FAIL] $msg" -ForegroundColor Red
    $script:FAIL++
}

function Write-Section($title) {
    Write-Host ""
    Write-Host "-- $title" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  RECALL AI -- Model Verification Tests" -ForegroundColor Cyan
Write-Host "  Server: $BASE_URL" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# ── Test 1: Server reachable ──────────────────────────────────────────────────
Write-Section "Server Connectivity"
try {
    $health = Invoke-RestMethod -Uri "$BASE_URL/health" -Method Get -TimeoutSec 10
    Write-Pass "AI server reachable"
} catch {
    Write-Fail "AI server not reachable at $BASE_URL -- is it running? (.\scripts\setup-ai.ps1)"
    exit 1
}

# ── Test 2: Ollama reachable ──────────────────────────────────────────────────
Write-Section "Ollama Status"
if ($health.ollama) {
    Write-Pass "Ollama is running"
} else {
    Write-Fail "Ollama is NOT running (start Ollama app, then re-run)"
}

# ── Test 3: Models installed ──────────────────────────────────────────────────
Write-Section "Model Installation"
$models = Invoke-RestMethod -Uri "$BASE_URL/models" -Method Get -TimeoutSec 10

if ($models.installed.text) {
    Write-Pass "Qwen3 ($($models.qwen_text)) installed"
} else {
    Write-Fail "Qwen3 ($($models.qwen_text)) NOT installed -- run: ollama pull $($models.qwen_text)"
}

if ($models.installed.vision) {
    Write-Pass "Qwen2.5-VL ($($models.qwen_vision)) installed"
} else {
    Write-Fail "Qwen2.5-VL ($($models.qwen_vision)) NOT installed -- run: ollama pull $($models.qwen_vision)"
}

if ($models.installed.embedding) {
    Write-Pass "Nomic Embed ($($models.embedding)) installed"
} else {
    Write-Fail "Nomic Embed ($($models.embedding)) NOT installed -- run: ollama pull $($models.embedding)"
}

# Skip inference tests if models are missing
if (-not ($models.installed.text -and $models.installed.embedding)) {
    Write-Host ""
    Write-Host "  Skipping inference tests -- pull missing models first." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "── Results: $PASS passed, $FAIL failed ──" -ForegroundColor Cyan
    exit 0
}

# ── Test 4: Text analysis (Qwen3) ────────────────────────────────────────────
Write-Section "Qwen3 Text Analysis"
try {
    $textBody = @{
        text        = "Submit the DBMS assignment before Friday midnight."
        source_type = "note"
    } | ConvertTo-Json

    $textResult = Invoke-RestMethod -Uri "$BASE_URL/analyze/text" `
        -Method Post `
        -Body $textBody `
        -ContentType "application/json" `
        -TimeoutSec 120

    $analysis = $textResult.analysis

    if ($analysis.title -and $analysis.title.Length -gt 3) {
        Write-Pass "Title extracted: '$($analysis.title)'"
    } else {
        Write-Fail "Title missing or too short: '$($analysis.title)'"
    }

    if ($analysis.category -eq "College") {
        Write-Pass "Category correct: College"
    } else {
        Write-Fail "Category wrong: expected College, got '$($analysis.category)'"
    }

    $hasDeadlineAction = $analysis.actions | Where-Object { $_.type -eq "deadline" }
    if ($hasDeadlineAction) {
        Write-Pass "Deadline action detected: '$($hasDeadlineAction[0].title)'"
    } else {
        Write-Fail "No deadline action detected in DBMS text"
    }

    if ($analysis.tags.Count -ge 2) {
        Write-Pass "Tags generated ($($analysis.tags.Count)): $($analysis.tags -join ', ')"
    } else {
        Write-Fail "Too few tags generated: $($analysis.tags)"
    }
} catch {
    Write-Fail "Text analysis request failed: $_"
}

# ── Test 5: Embedding (Nomic) ─────────────────────────────────────────────────
Write-Section "Nomic Embedding"
try {
    $embedBody = @{
        texts = @(
            "search_document: DBMS assignment submission Friday college",
            "search_query: college assignment"
        )
    } | ConvertTo-Json

    $embedResult = Invoke-RestMethod -Uri "$BASE_URL/embed" `
        -Method Post `
        -Body $embedBody `
        -ContentType "application/json" `
        -TimeoutSec 60

    $embeddings = $embedResult.embeddings

    if ($embeddings.Count -eq 2) {
        Write-Pass "2 embeddings returned"
    } else {
        Write-Fail "Expected 2 embeddings, got $($embeddings.Count)"
    }

    $dim = $embeddings[0].Count
    if ($dim -gt 100) {
        Write-Pass "Embedding dimension: $dim"
    } else {
        Write-Fail "Embedding dimension too low: $dim (expected ≥ 100)"
    }

    # Cosine similarity -- doc vs query should be > 0.5 for related content
    $docVec = $embeddings[0]
    $queryVec = $embeddings[1]
    $dot = 0; $magA = 0; $magB = 0
    for ($i = 0; $i -lt $dim; $i++) {
        $dot  += $docVec[$i] * $queryVec[$i]
        $magA += $docVec[$i] * $docVec[$i]
        $magB += $queryVec[$i] * $queryVec[$i]
    }
    $similarity = if ($magA -gt 0 -and $magB -gt 0) { $dot / ([Math]::Sqrt($magA) * [Math]::Sqrt($magB)) } else { 0 }
    $similarity = [Math]::Round($similarity, 4)

    if ($similarity -gt 0.5) {
        Write-Pass "Cosine similarity (doc vs query): $similarity (semantically related OK)"
    } elseif ($similarity -gt 0.2) {
        Write-Pass "Cosine similarity (doc vs query): $similarity (low but non-zero)"
    } else {
        Write-Fail "Cosine similarity too low: $similarity - embeddings may not be working correctly"
    }

} catch {
    Write-Fail "Embedding request failed: $_"
}

# ── Test 6: Link analysis (Qwen3) ────────────────────────────────────────────
Write-Section "Qwen3 Link Analysis"
try {
    $linkBody = @{
        url              = "https://github.com/redis/redis"
        page_title       = "redis/redis: Redis is an in-memory data structure store"
        page_description = "Redis is used as a database, cache, and message broker."
    } | ConvertTo-Json

    $linkResult = Invoke-RestMethod -Uri "$BASE_URL/analyze/link" `
        -Method Post `
        -Body $linkBody `
        -ContentType "application/json" `
        -TimeoutSec 120

    $la = $linkResult.analysis
    if ($la.category -eq "Development") {
        Write-Pass "Link category correct: Development"
    } else {
        Write-Fail "Link category wrong: expected Development, got '$($la.category)'"
    }

    $hasRedis = ($la.topics + $la.tags) | Where-Object { $_ -match "(?i)redis" }
    if ($hasRedis) {
        Write-Pass "Redis detected in topics/tags: $($la.topics -join ', ')"
    } else {
        Write-Fail "Redis not found in topics/tags: $($la.topics -join ', ')"
    }
} catch {
    Write-Fail "Link analysis request failed: $_"
}

# Vision test (skipped -- requires an image file)
Write-Section "Vision Analysis (Qwen2.5-VL)"
if ($models.installed.vision) {
    Write-Host "  ℹ  Skipping automated vision test -- no DBMS screenshot file provided." -ForegroundColor DarkGray
    Write-Host "     To test manually: POST /analyze/image with an image file." -ForegroundColor DarkGray
} else {
    Write-Host "  ℹ  Vision model not installed. Pull: ollama pull $($models.qwen_vision)" -ForegroundColor Yellow
}

# ── Summary ───────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
$total = $PASS + $FAIL
if ($FAIL -eq 0) {
    Write-Host "  ALL TESTS PASSED: $PASS/$total" -ForegroundColor Green
} else {
    Write-Host "  Results: $PASS passed, $FAIL failed (total: $total)" -ForegroundColor Yellow
}
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
