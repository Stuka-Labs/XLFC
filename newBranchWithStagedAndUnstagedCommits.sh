#!/bin/bash

# Ask for the new branch name
echo "Enter new branch name: "
read branch_name

# Create and switch to the new branch
git checkout -b "$branch_name"

# Check if branch creation was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to create new branch."
    exit 1
fi

echo "Switched to new branch: $branch_name"

# Stage all changes (staged and unstaged)
git add .

# Commit changes
echo "Enter a commit message: "
read commit_message

git commit -m "$commit_message"

# Check if commit was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to commit changes."
    exit 1
fi

echo "Changes committed to branch: $branch_name"

# Push the new branch to the remote
git push --set-upstream origin "$branch_name"

# Check if push was successful
if [ $? -ne 0 ]; then
    echo "Error: Failed to push the branch to remote."
    exit 1
fi

echo "Branch $branch_name pushed successfully."
