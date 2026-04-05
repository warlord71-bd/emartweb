import os

# Path to the shop page that is causing the build error
file_path = 'src/app/shop/page.tsx'

if os.path.exists(file_path):
    with open(file_path, 'r') as file:
        content = file.read()

    # Check if the fix is already there to avoid duplicates
    if "export const dynamic = 'force-dynamic'" not in content:
        print(f"Applying fix to {file_path}...")
        # Add the force-dynamic export to the top of the file
        new_content = "export const dynamic = 'force-dynamic';\n" + content
        
        with open(file_path, 'w') as file:
            file.write(new_content)
        print("Fix applied successfully!")
    else:
        print("Fix already exists in the file.")
else:
    print(f"Error: {file_path} not found. Check if the path is correct.")
