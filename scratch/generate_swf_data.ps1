$swfFolder = "OTOMOTIF"
$outputFile = "js/swf-data.js"
$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("/**")
[void]$sb.AppendLine(" * SWF Binary Data in Base64 format")
[void]$sb.AppendLine(" * AutoMaster offline package")
[void]$sb.AppendLine(" */")
[void]$sb.AppendLine("const SWF_DATA = {")

$files = Get-ChildItem -Path $swfFolder -Filter *.swf
$count = $files.Count
$i = 0
foreach ($file in $files) {
    $i++
    $name = $file.Name
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $base64 = [System.Convert]::ToBase64String($bytes)
    [void]$sb.Append("  `"$name`": `"$base64`"")
    if ($i -lt $count) {
        [void]$sb.AppendLine(",")
    } else {
        [void]$sb.AppendLine("")
    }
}
[void]$sb.AppendLine("};")
[System.IO.File]::WriteAllText($outputFile, $sb.ToString())
Write-Output "SWF Data JS generated successfully!"
