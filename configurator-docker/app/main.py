import os
import yaml
from jinja2 import Environment, FileSystemLoader
from jinja2.exceptions import TemplateNotFound
import logging

# Merge configuration in possibly nested dictionaries
def merge_config(default_config, user_config):
    """
    Recursively merge user_config into default_config.
    For each key in user_config:
      - If the value is a dict and the key exists in default_config as a dict, merge recursively.
      - Otherwise, if the value is not None, overwrite or add the key in default_config.
    """
    for key in user_config:
        if (key in default_config) and isinstance(user_config[key], dict) and isinstance(default_config[key], dict):
            merge_config(default_config[key], user_config[key])
        elif user_config[key] is not None:
            default_config[key] = user_config[key]

env = Environment(loader=FileSystemLoader('.'))

# Load default configuration
config = yaml.safe_load(env.get_template('default-config.yaml.j2').render())

# Load configuration from config.yaml.j2, if it exists
try:
    user_config = yaml.safe_load(env.get_template('config.yaml.j2').render())
    merge_config(config, user_config)
except TemplateNotFound:
    pass


logging.basicConfig(level=logging.INFO, format='[%(levelname)s] %(message)s')

# Define a function to render all templates in a folder
def render_folder(template_root, output_root):
    """
    Render all Jinja2 templates in template_root (recursively) to output_root.
    - For files ending with .j2, render using the global config and write output without the .j2 extension.
    - For other files, copy them as-is to the output directory, preserving structure.
    Logs info and errors for each file processed.
    """
    # Set up the Jinja2 environment
    env = Environment(loader=FileSystemLoader(template_root))
    def render_helper(subfolder):
        """
        Helper function to recursively process files and directories under subfolder.
        """
        # Loop through all files in the folder
        for filename in os.listdir(os.path.join(template_root, subfolder)):
            # Get the full path of the file
            input_subpath = os.path.join(subfolder, filename)
            # Check if the file is a directory
            if os.path.isdir(os.path.join(template_root, input_subpath)):
                # Recursively call the render_helper function
                render_helper(input_subpath)
            # Check if the file is a template file
            else:
                output_folder = os.path.join(output_root, subfolder)
                # Create the output folder if it doesn't exist
                os.makedirs(output_folder, exist_ok=True)
                output_filename = os.path.join(output_folder, filename)
                if filename.endswith('.j2'):
                    try:
                        # Render the template
                        template = env.get_template(input_subpath)
                        output = template.render(config)
                        # Write the output to a file without .j2
                        with open(output_filename[:-3], 'w') as f:
                            f.write(output)
                        logging.info(f"Rendered template: {input_subpath} -> {output_filename[:-3]}")
                    except Exception as e:
                        logging.error(f"Failed to render template {input_subpath}: {e}")
                else:
                    # Write non-template files directly to the output folder
                    try:
                        with (open(os.path.join(template_root, input_subpath), 'rb') as input_file, \
                              open(output_filename, 'wb') as output_file):
                            output_file.write(input_file.read())
                        logging.info(f"Copied file: {input_subpath} -> {output_filename}")
                    except Exception as e:
                        logging.error(f"Failed to copy file {input_subpath}: {e}")
    render_helper('.')

if __name__ == "__main__":
    # Render all templates in the "template" folder
    logging.info("Starting template rendering from /template to /dist...")
    render_folder('/template', '/dist')
    logging.info("Rendering complete.")