#!/bin/bash

# Script to normalize line endings to LF in the entire project
# Usage: Place in project root and run with bash (Git Bash on Windows)

echo "Starting line ending normalization process..."

# Find all text files and convert to LF
find . -type f -not -path "./.git/*" \
       -not -path "./node_modules/*" \
       -not -path "./dist/*" \
       -exec grep -Il "" {} \; | while read file; do
  echo "Converting: $file"
  # Convert CRLF to LF
  sed -i 's/\r$//' "$file"
done

echo "Line ending normalization complete!"
echo "Remember to stage and commit these changes."