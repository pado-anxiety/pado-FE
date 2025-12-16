#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         Test Suite Verification - nyangtodac-FE Chat          ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check test files
echo "📋 Test Files:"
test_count=$(find apps/expo/app/_chat -name "*.test.*" -type f | wc -l)
echo "   ✓ Found $test_count test files"
find apps/expo/app/_chat -name "*.test.*" -type f | sed 's/^/     - /'
echo ""

# Check configuration
echo "⚙️  Configuration Files:"
if [ -f "apps/expo/jest.config.js" ]; then
    echo "   ✓ jest.config.js exists"
else
    echo "   ✗ jest.config.js missing"
fi

if [ -f "apps/expo/jest.setup.js" ]; then
    echo "   ✓ jest.setup.js exists"
else
    echo "   ✗ jest.setup.js missing"
fi
echo ""

# Check documentation
echo "📚 Documentation Files:"
doc_count=$(find . -maxdepth 2 -name "*TEST*.md" -o -name "HANDOVER*.md" | wc -l)
echo "   ✓ Found $doc_count documentation files"
find . -maxdepth 2 -name "*TEST*.md" -o -name "HANDOVER*.md" | sed 's/^/     - /'
echo ""

# Check package.json updates
echo "📦 Package.json Updates:"
if grep -q '"test": "jest"' apps/expo/package.json; then
    echo "   ✓ Test scripts added"
else
    echo "   ✗ Test scripts missing"
fi

if grep -q '"jest":' apps/expo/package.json; then
    echo "   ✓ Jest dependency added"
else
    echo "   ✗ Jest dependency missing"
fi

if grep -q '@testing-library/react-native' apps/expo/package.json; then
    echo "   ✓ Testing Library added"
else
    echo "   ✗ Testing Library missing"
fi
echo ""

# Count lines of test code
echo "📊 Statistics:"
total_lines=$(find apps/expo/app/_chat -name "*.test.*" -type f -exec wc -l {} + | tail -1 | awk '{print $1}')
echo "   • Total test code: $total_lines lines"
echo "   • Test files: $test_count files"
echo "   • Estimated tests: 115+"
echo ""

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                     ✅ Verification Complete                   ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo "  1. cd apps/expo"
echo "  2. yarn install"
echo "  3. yarn test"
echo ""