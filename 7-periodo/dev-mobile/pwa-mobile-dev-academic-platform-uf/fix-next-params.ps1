# Script para backup e recuperação dos arquivos corrigidos

# Função para fazer backup de um arquivo
function Backup-File {
    param (
        [string]$Path
    )
    
    $backupPath = "$Path.bak"
    if (-not (Test-Path $backupPath)) {
        Copy-Item -Path $Path -Destination $backupPath
        Write-Host "Backup criado: $backupPath"
    } else {
        Write-Host "Backup já existe: $backupPath"
    }
}

# Função para restaurar um arquivo de backup
function Restore-File {
    param (
        [string]$Path
    )
    
    $backupPath = "$Path.bak"
    if (Test-Path $backupPath) {
        Copy-Item -Path $backupPath -Destination $Path -Force
        Write-Host "Arquivo restaurado de: $backupPath"
    } else {
        Write-Host "Backup não encontrado: $backupPath"
    }
}

# Função para aplicar a versão corrigida
function Apply-Fixed-File {
    param (
        [string]$OriginalPath,
        [string]$FixedPath
    )
    
    if (Test-Path $FixedPath) {
        # Fazer backup do original primeiro
        Backup-File -Path $OriginalPath
        
        # Copiar a versão corrigida
        Copy-Item -Path $FixedPath -Destination $OriginalPath -Force
        Write-Host "Versão corrigida aplicada: $OriginalPath"
    } else {
        Write-Host "Arquivo corrigido não encontrado: $FixedPath"
    }
}

# Caminhos dos arquivos
$tarefasPath = "app\projetos\[id]\tarefas\page.tsx"
$tarefasFixedPath = "app\projetos\[id]\tarefas\page-fixed.tsx"
$kanbanPath = "app\projetos\[id]\kanban\page.tsx"
$kanbanFixedPath = "app\projetos\[id]\kanban\page-fixed.tsx"

# Verificar argumentos da linha de comando
if ($args.Count -eq 0) {
    Write-Host "Uso: .\fix-next-params.ps1 [backup|restore|apply]"
    exit
}

switch ($args[0].ToLower()) {
    "backup" {
        Backup-File -Path $tarefasPath
        Backup-File -Path $kanbanPath
    }
    "restore" {
        Restore-File -Path $tarefasPath
        Restore-File -Path $kanbanPath
    }
    "apply" {
        Apply-Fixed-File -OriginalPath $tarefasPath -FixedPath $tarefasFixedPath
        Apply-Fixed-File -OriginalPath $kanbanPath -FixedPath $kanbanFixedPath
    }
    default {
        Write-Host "Comando desconhecido. Use: .\fix-next-params.ps1 [backup|restore|apply]"
    }
}
