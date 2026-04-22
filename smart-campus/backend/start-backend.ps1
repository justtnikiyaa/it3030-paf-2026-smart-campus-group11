$mavenVersion = "3.9.9"
$mavenZipUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$toolsDir = "$PSScriptRoot\.tools"
$mavenDir = "$toolsDir\apache-maven-$mavenVersion"
$mavenExe = "$mavenDir\bin\mvn.cmd"

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
