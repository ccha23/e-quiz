# E-Quiz

## Updating Moodle Version

To update the Moodle version used in your build:

1. Edit the script at `template/html-docker/bin/get_moodle.sh`.
2. Change the download URL to the desired Moodle release (see comments in the script for examples).
3. Rebuild the distribution using `make config` (see below).

## Adding or Updating Moodle Plugins

To add or update Moodle plugins:

1. **Add or Update Plugin Download Scripts:**
   - Place or update the plugin download/extract script in `template/html-docker/bin/` (e.g., `get_coderunner.sh`, `get_stack.sh`, etc.).
   - Follow the style of the existing scripts for downloading and extracting plugin files into the correct subdirectory of `/var/www/html`.

2. **Register the Plugin in the Build Template:**
   - Edit `template/html-docker/Dockerfile.j2`.
   - Add a `COPY` and `RUN` line for your new script, wrapped in a Jinja2 conditional if you want it to be configurable (see how existing plugins are handled).

3. **Enable the Plugin in the Configuration:**
   - Edit `config.yaml.j2` in the project root.
   - Under the `plugins:` section, set your plugin’s `enabled` value to `true`.

4. **Rebuild the Distribution:**
   - Run `make config` from the project root. This will render the templates and generate the distribution files in the `dist/` directory.

## Building and Deploying

- Use `make all` or `make upgrade` to regenerate and upgrade the distribution.
- See the `Makefile` for additional commands to build Docker images, run tests, or deploy to Kubernetes.

## Notes

- All configuration is managed via `config.yaml.j2` and the Jinja2 templates in `template/html-docker/`.
- Do not edit files in `dist/` directly; always update the templates or configuration and regenerate.
- For more details on configuration options, see comments in `config.yaml.j2`.
