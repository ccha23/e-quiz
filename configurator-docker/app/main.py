import os
import yaml
from jinja2 import Environment, FileSystemLoader
from jinja2.exceptions import TemplateNotFound

# Merge configuration in possibly nested dictionaries
def merge_config(default_config, user_config):
    """ Add any new or updated key-value pairs from user_config into default_config. """
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


# Define a function to render all templates in a folder
def render_folder(template_root, output_root):
    # Set up the Jinja2 environment
    env = Environment(loader=FileSystemLoader(template_root))
    def render_helper(subfolder):
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
                    # Render the template
                    template = env.get_template(input_subpath)
                    output = template.render(config)
                    # Write the output to a file without .j2
                    with open(output_filename[:-3], 'w') as f:
                        f.write(output)
                else:
                    # Write non-template files directly to the output folder
                    with (open(os.path.join(template_root, input_subpath), 'rb') as input_file, 
                          open(output_filename, 'wb') as output_file):
                        output_file.write(input_file.read())               
    render_helper('.')

# Render all templates in the "template" folder
render_folder('/template', '/dist')