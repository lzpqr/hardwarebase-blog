$t = [System.IO.File]::ReadAllText('H:\ai\codex\web\tools\home.html', [System.Text.Encoding]::UTF8)
$m = [regex]::Matches($t, 'class="hb-hero-title">[^<]*<')
if ($m.Count) { $m | ForEach-Object { $_.Value } }
$m2 = [regex]::Matches($t, 'class="hb-cat-eyebrow">[^<]*<')
if ($m2.Count) { $m2 | ForEach-Object { $_.Value } }
$names = [regex]::Matches($t, 'class="hb-cat-name" href="[^"]*">([^<]*)')
'--- group names:'
$names | ForEach-Object { $_.Groups[1].Value }
'--- hero count: ' + ([regex]::Matches($t, 'id="hb-hero"').Count)
'--- sub desc: '
$sub = [regex]::Match($t, 'class="hb-hero-sub">([^<]*)<')
if ($sub.Success) { $sub.Groups[1].Value }
