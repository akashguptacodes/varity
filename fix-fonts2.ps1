$files = @(
    "d:\Varity\src\components\BookCallSection.jsx",
    "d:\Varity\src\components\Navbar.jsx",
    "d:\Varity\src\components\UIOverlay.jsx",
    "d:\Varity\src\components\TestimonialsSection.jsx",
    "d:\Varity\src\components\FooterSection.jsx",
    "d:\Varity\src\components\CTASection.jsx",
    "d:\Varity\src\components\FeaturesSection.jsx",
    "d:\Varity\src\app\about\page.js",
    "d:\Varity\src\app\categories\[categoryId]\page.jsx"
)

foreach ($f in $files) {
    if (Test-Path $f) {
        $c = Get-Content $f -Raw
        $c = $c -replace [regex]::Escape("'Helvetica Neue', Helvetica, Arial, sans-serif"), "var(--font-arimo), 'Helvetica Neue', Helvetica, Arial, sans-serif"
        Set-Content $f $c -NoNewline
        Write-Host "Updated: $f"
    } else {
        Write-Host "SKIP (not found): $f"
    }
}
