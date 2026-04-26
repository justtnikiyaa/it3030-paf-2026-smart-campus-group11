$mavenVersion = "3.9.9"
$mavenZipUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$toolsDir = "$PSScriptRoot\.tools"
$mavenDir = "$toolsDir\apache-maven-$mavenVersion"
$mavenExe = "$mavenDir\bin\mvn.cmd"

$envFile = Join-Path $PSScriptRoot ".env"
$allowedEnvKeys = @(
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "FRONTEND_URL",
    "ADMIN_EMAILS",
    "UPLOAD_DIR"
)

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()

        if ([string]::IsNullOrWhiteSpace($line) -or $line.StartsWith("#")) {
            return
        }

        $parts = $line -split '=', 2
        if ($parts.Length -ne 2) {
            return
        }

        $key = $parts[0].Trim()
        $value = $parts[1].Trim().Trim('"')

        if ($allowedEnvKeys -notcontains $key) {
            return
        }

        # Keep externally provided variables higher priority than .env values.
        if (-not [string]::IsNullOrWhiteSpace((Get-Item -Path "Env:$key" -ErrorAction SilentlyContinue).Value)) {
            return
        }

        Set-Item -Path "Env:$key" -Value $value
    }
}

if (-not (Test-Path $mavenExe)) {
    Write-Host "Downloading Maven $mavenVersion..."
    New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null
    $zipPath = "$toolsDir\maven.zip"
    Invoke-WebRequest -Uri $mavenZipUrl -OutFile $zipPath
    Write-Host "Extracting Maven..."
    Expand-Archive -Path $zipPath -DestinationPath $toolsDir -Force
    Remove-Item $zipPath
}

Write-Host "Starting Spring Boot backend..."
& $mavenExe spring-boot:run
