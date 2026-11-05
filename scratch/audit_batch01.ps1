Add-Type -AssemblyName System.Drawing

$batch = Get-Content -Raw "project-docs/assets/batches/batch-01-ui-icons.json" | ConvertFrom-Json

$results = @()

foreach ($a in $batch.assets) {
    $p = Join-Path "C:\Users\dungu\Documents\test\Zombie-World-RPG" $a.file
    $exists = Test-Path $p
    if (-not $exists) {
        $results += [PSCustomObject]@{
            ID = $a.id
            File = $a.file
            Status = "MISSING"
            Dimensions = "N/A"
            Format = "N/A"
            FileSizeKB = 0
            TransparentPct = 0
            CornerA = -1
            AuditResult = "FAIL"
        }
        continue
    }

    $len = (Get-Item $p).Length
    $bmp = [System.Drawing.Bitmap]::FromFile($p)
    $w = $bmp.Width
    $h = $bmp.Height
    $fmt = $bmp.PixelFormat.ToString()
    
    $c0 = $bmp.GetPixel(0, 0)
    
    $trans = 0
    $semi = 0
    $opaque = 0
    $step = 4
    for ($y = 0; $y -lt $h; $y += $step) {
        for ($x = 0; $x -lt $w; $x += $step) {
            $px = $bmp.GetPixel($x, $y)
            if ($px.A -eq 0) { $trans++ }
            elseif ($px.A -eq 255) { $opaque++ }
            else { $semi++ }
        }
    }
    $tot = $trans + $semi + $opaque
    $transPct = [math]::Round($trans * 100 / $tot, 1)
    $opaquePct = [math]::Round($opaque * 100 / $tot, 1)
    
    $bmp.Dispose()

    $dimOk = ($w -eq $a.width) -and ($h -eq $a.height)
    $transOk = ($c0.A -eq 0) -and ($transPct -gt 10)
    $fmtOk = ($fmt -eq "Format32bppArgb")
    $auditPass = $dimOk -and $transOk -and $fmtOk

    $results += [PSCustomObject]@{
        ID = $a.id
        Dimensions = "${w}x${h}"
        Expected = "$($a.width)x$($a.height)"
        Format = $fmt
        FileSizeKB = [math]::Round($len / 1024, 1)
        TransPct = "${transPct}%"
        CornerA = $c0.A
        Audit = if ($auditPass) { "PASS" } else { "FAIL" }
    }
}

$results | Format-Table -AutoSize

