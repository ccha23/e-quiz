# Configurator Docker

This directory contains a Docker-based configurator for rendering configuration files and templates for the e-quiz platform. The configurator is designed to process Jinja2 templates using YAML configuration files, producing ready-to-use configuration and manifest files for deployment.

## How to Build the Image

This directory provides a Makefile to simplify building and managing the configurator Docker image:

- `make` or `make all`: Build the configurator Docker image with the default tag (latest). This will only rebuild if the source files have changed.
- `make build_configurator_latest`: Force build the configurator image with the `latest` tag, regardless of existing images.
- `make clean`: Remove the hidden `.built_*` files to force a rebuild on the next `make`.

The Makefile tracks changes to the source files (`app/*` and `Dockerfile`). If any of these change, the image will be rebuilt. Dummy hidden files (e.g., `.built_configurator_latest`) are used to avoid unnecessary rebuilds. The image is always tagged as `configurator:latest` by default, but you can specify a different tag by running `make build_configurator_<tag>`.

## How to Run the Configurator

```sh
docker run --rm \
    -u $(id -u):$(id -g) \
    -v /absolute/path/to/template:/template \
    -v /absolute/path/to/dist:/dist \
    -v /absolute/path/to/default-config.yaml.j2:/app/default-config.yaml.j2 \
    -v /absolute/path/to/config.yaml.j2:/app/config.yaml.j2 \
    configurator:latest
```

- Replace `/absolute/path/to/...` with the actual paths on your system.
- The `/template` directory should contain your Jinja2 templates.
- The `/dist` directory will receive the rendered output.
- The `default-config.yaml.j2` is required; `config.yaml.j2` is optional for overrides.

## How It Works

The configurator runs as a Docker container based on Alpine Linux and Python 3. The main logic is in `app/main.py`:

- It uses Jinja2 to render templates found in the `/template` directory, using configuration values from `default-config.yaml.j2` and (optionally) `config.yaml.j2`.
- The merging logic ensures that user-provided configuration overrides the defaults, supporting nested dictionaries.
- All templates (`*.j2`) are rendered to the `/dist` directory, with the `.j2` extension removed. Non-template files are copied as-is, preserving directory structure.
