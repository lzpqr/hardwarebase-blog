$src = 'H:\ai\codex\web\source\_posts'
Get-ChildItem $src -Filter '*.md' | ForEach-Object {
  $f = Get-Content $_.FullName -Raw -Encoding UTF8
  $slug = [regex]::Match($f, '(?m)^slug:\s*(\S+)').Groups[1].Value
  $title = [regex]::Match($f, '(?m)^title:\s*(.+)$').Groups[1].Value
  if (-not $slug -and $slug -eq '') { $slug = $_.BaseName }
  [PSCustomObject]@{ slug = $slug; title = $title }
} | Select-Object -Property slug, title | Format-Table -AutoSize
