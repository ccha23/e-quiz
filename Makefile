template_dir:= $(CURDIR)/template
dist_dir := $(CURDIR)/dist
tag := latest

# TODO: custom names for dist folders and config.yaml.js
all: upgrade

# Helm upgrade equiz
upgrade: config dist.upgrade

# Test the docker images with docker-compose
# See docker-compose.yaml
up: config dist.up

# Generate the configuration file config.yaml.j2 from the default
# NOTE:
#   - To obtain the default config.yaml.j2, remove/move any existing config.yaml.js file.
config.yaml.j2:
	@if [ ! -f config.yaml.j2 ]; then \
		echo "Generating the configuration file config.yaml.j2 from the default..."; \
		cp default-config.yaml.j2 config.yaml.j2; \
	fi

# Render /template to $(dist_dir) to configure equiz according to config.yaml.j2.
config: config.yaml.j2
	@cd configurator-docker && make tag=$(tag)
	@mkdir -p $(dist_dir) && docker run --rm \
	  -u $$(stat -c '%u:%g' $(dist_dir)) \
	  -v $(template_dir):/template \
      -v $(dist_dir):/dist \
      -v $(CURDIR)/default-config.yaml.j2:/app/default-config.yaml.j2 \
      -v $(CURDIR)/config.yaml.j2:/app/config.yaml.j2 \
	  configurator:$(tag)

# Pass other make commands to $(dist_dir) subfolder generated by `make config`
# See the available commands in $(dist_dir)/Makefile, which include
#   - building equiz images and test run them using docker-compose (TODO: link to setup instructions)
#   - deploying equiz to a kubernetes cluster (TODO: link to setup instructions)
# NOTE: 
#   - The command reruns make config to generate $(dist_dir), which overwrites any edits to the files in $(dist_dir). 
#     To preserve the manual edits, `cd $(dist_dir)` to run make commands without make config.
dist.%:
	@if [ -d $(dist_dir) ]; then \
		cd $(dist_dir) && make $*; \
	else \
		echo "Run `make config` to generate the distribution folder $(dist_dir) first." && exit 1; \
	fi

# Remove $(dist_dir) after passing clean command to $(dist_dir)
clean:
	@if [ -d $(dist_dir) ]; then \
		cd $(dist_dir) && make clean && \
		cd .. && rm -rf $(dist_dir); \
	fi

.PHONY: config clean all up upgrade dist.%