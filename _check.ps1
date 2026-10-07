$urls = @("http://localhost:4000/", "http://localhost:4000/css/index.css", "http://localhost:4000/vendor/fontawesome/css/all.min.css", "http://localhost:4000/js/main.js", "http://localhost:4000/js/utils.js")
foreach ($u in $urls) {
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  try {
    $r = [System.Net.WebRequest]::Create($u)
    $resp = $r.GetResponse()
    $sw.Stop()
    $stream = $resp.GetResponseStream()
    $len = 0
    while ($true) { $buf = New-Object byte[] 4096; $n = $stream.Read($buf,0,4096); if ($n -le 0) {break}; $len += $n }
    Write-Output ($u + "  " + $sw.ElapsedMilliseconds + "ms  " + $len + "B")
  } catch {
    Write-Output ($u + "  ERR: " + $_.Exception.Message)
  }
}
