$h = Get-Content "H:\ai\codex\web\_home.html" -Raw -Encoding utf8
$idx = $h.IndexOf([regex]::Escape("hb-hero-chips-label"))
$idx2 = $h.IndexOf([regex]::Escape("hb-hero-chips-label"), $idx+30)
$idx3 = $h.IndexOf([regex]::Escape("hb-hero-chips-label"), $idx2+30)
$idx4 = $h.IndexOf([regex]::Escape("hb-hero-chips-label"), $idx3+30)
$idx5 = $h.IndexOf([regex]::Escape("hb-hero-chips-label"), $idx4+30)
Write-Output ("l1=" + $idx + " l2=" + $idx2 + " l3=" + $idx3 + " l4=" + $idx4 + " l5=" + $idx5)
