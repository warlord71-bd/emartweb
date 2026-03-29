#!/bin/bash

# Emart File Structure Checker
# Run this on your VPS to verify files

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         EMART NEXTJS PROJECT - FILE STRUCTURE AUDIT            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "📁 Project Directory: $PROJECT_DIR"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}1. PROJECT STRUCTURE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Check for main zip file
if [ -f "$PROJECT_DIR/emart-nextjs-site.zip" ]; then
    SIZE=$(du -h "$PROJECT_DIR/emart-nextjs-site.zip" | cut -f1)
    echo -e "${GREEN}✓${NC} emart-nextjs-site.zip ($SIZE) - ${GREEN}KEEP${NC} (Main source)"
else
    echo -e "${RED}✗${NC} emart-nextjs-site.zip - NOT FOUND"
fi
echo ""

# List all .tsx files
echo -e "${BLUE}2. TYPESCRIPT/REACT COMPONENTS (.tsx files)${NC}"
echo -e "${BLUE}─────────────────────────────────────────${NC}"
if [ -d "$PROJECT_DIR" ]; then
    find "$PROJECT_DIR" -maxdepth 1 -name "*.tsx" -type f -exec ls -lh {} \; | awk '{
        filename=$NF;
        if (filename ~ /all-remaining|product-detail-page/) {
            printf "  %-35s %6s  %s\n", filename, $5, "REFERENCE/DUPLICATE"
        } else {
            printf "  %-35s %6s  %s\n", filename, $5, "IN USE"
        }
    }'
fi
echo ""

# List other files
echo -e "${BLUE}3. SUPPORT FILES${NC}"
echo -e "${BLUE}─────────────────────────────────────────${NC}"
ls -lh "$PROJECT_DIR" | grep -E "\.(ts|js|html|css|txt|json)$" | awk '{
    filename=$NF;
    size=$5;
    if (filename ~ /openclaw|emart-preview|config-files/) {
        printf "  %-35s %6s  %s\n", filename, size, "REMOVE"
    } else if (filename ~ /\.zip$/) {
        printf "  %-35s %6s  %s\n", filename, size, "KEEP"
    } else {
        printf "  %-35s %6s  %s\n", filename, size, "CHECK"
    }
}'
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}4. SUMMARY - WHAT TO REMOVE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

REMOVE_FILES=(
    "all-remaining.tsx"
    "emart-preview.html"
    "openclaw-system-prompt.txt"
)

echo -e "${RED}DELETE THESE FILES:${NC}"
for file in "${REMOVE_FILES[@]}"; do
    if [ -f "$PROJECT_DIR/$file" ]; then
        SIZE=$(du -h "$PROJECT_DIR/$file" | cut -f1)
        echo "  ✂️  $file ($SIZE)"
    fi
done
echo ""

echo -e "${GREEN}KEEP THESE:${NC}"
KEEP_FILES=(
    "emart-nextjs-site.zip (Main source - DO NOT DELETE)"
    "*.tsx files (Active components)"
    "cartStore.ts (Cart state management)"
    "woocommerce.ts (API client)"
    "globals.css (Styling)"
)

for file in "${KEEP_FILES[@]}"; do
    echo "  ✓ $file"
done
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}5. CLEANUP COMMAND${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Run this to remove unnecessary files:"
echo ""
echo -e "${YELLOW}rm -f all-remaining.tsx emart-preview.html openclaw-system-prompt.txt${NC}"
echo ""

echo -e "${BLUE}6. VERIFY ZIP INTEGRITY${NC}"
echo -e "${BLUE}─────────────────────────────────────────${NC}"
if [ -f "$PROJECT_DIR/emart-nextjs-site.zip" ]; then
    echo "Testing zip file integrity..."
    unzip -t "$PROJECT_DIR/emart-nextjs-site.zip" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Zip file is valid${NC}"
    else
        echo -e "${RED}✗ Zip file is corrupted${NC}"
    fi
    echo ""
    echo "Zip contents (core files):"
    unzip -l "$PROJECT_DIR/emart-nextjs-site.zip" | grep -E "(page\.tsx|Component|\.ts|\.css)" | head -20
else
    echo -e "${RED}✗ emart-nextjs-site.zip not found${NC}"
fi
echo ""

echo "✅ Audit complete!"
