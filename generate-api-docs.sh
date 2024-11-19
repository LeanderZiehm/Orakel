#!/bin/bash

# Source and destination directories
SOURCE_DIR="./static"  # Replace with your source directory containing .js files
DEST_DIR="./docs/src/content/docs/api"

# Ensure the destination directory exists
mkdir -p "$DEST_DIR"

# Process each .js file in the source directory
find "$SOURCE_DIR" -type f -name "*.js" | while read -r FILE; do
    # Get the relative path from the source directory
    RELATIVE_PATH="${FILE#$SOURCE_DIR/}"
    
    # Change extension from .js to .md
    OUTPUT_FILE="$DEST_DIR/${RELATIVE_PATH%.js}.md"
    
    # Ensure the destination subdirectory exists
    mkdir -p "$(dirname "$OUTPUT_FILE")"
    
    # Generate documentation
    echo "Generating documentation for $FILE -> $OUTPUT_FILE"
    pnpm exec jsdoc2md "$FILE" > "$OUTPUT_FILE"
    
    # Check for errors
    if [ $? -ne 0 ]; then
        echo "Error generating documentation for $FILE" >&2
    fi
done

echo "Documentation generation complete."
