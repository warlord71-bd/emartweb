#!/bin/bash

# Quick Emart Project Check (One-liner friendly)

echo "📁 Project Files:"
ls -lh *.{tsx,ts,zip,html,css,txt} 2>/dev/null | awk '{printf "  %-35s %8s\n", $NF, $5}'

echo ""
echo "🔍 File Status:"
[ -f emart-nextjs-site.zip ] && echo "  ✓ emart-nextjs-site.zip - KEEP" || echo "  ✗ emart-nextjs-site.zip - MISSING"
[ -f all-remaining.tsx ] && echo "  ✂️  all-remaining.tsx - DELETE" || echo "  ✓ all-remaining.tsx - removed"
[ -f emart-preview.html ] && echo "  ✂️  emart-preview.html - DELETE" || echo "  ✓ emart-preview.html - removed"
[ -f openclaw-system-prompt.txt ] && echo "  ✂️  openclaw-system-prompt.txt - DELETE" || echo "  ✓ openclaw-system-prompt.txt - removed"
[ -f config-files.ts ] && echo "  ✂️  config-files.ts - DELETE" || echo "  ✓ config-files.ts - removed"

echo ""
echo "📦 Zip Integrity:"
unzip -t emart-nextjs-site.zip > /dev/null 2>&1 && echo "  ✓ ZIP VALID" || echo "  ✗ ZIP CORRUPTED"

echo ""
echo "🧹 Cleanup Command:"
echo "  rm -f all-remaining.tsx emart-preview.html openclaw-system-prompt.txt config-files.ts"
