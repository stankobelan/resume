#!/bin/bash

# Script to run ESLint auto-fix on all relevant files
# This will automatically fix all fixable problems

echo "Starting ESLint auto-fix for all files..."

# Run ESLint with the --fix flag on all relevant directories
npx eslint --ext .js,.ts,.vue src tests --fix

echo "ESLint auto-fix complete!"