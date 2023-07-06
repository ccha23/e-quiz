# To build the configurator docker image that renders the template files to distribution files.
# The configurator uses jinja2 to render jinja2 templates with extension { filename }.j2 to { filename }.
# The configurator is ensure consistency in configurations, e.g., the WWWROOT environment variable needed 
# by moodle should be consistent with the path exposed by the ingress resource in kubernetes.
# The rendered files in the distribution are standalone and can be further reconfigured.

# Source files for building the image
src_files := $(wildcard app/*) Dockerfile
# Docker image name
name := configurator
# Docker image tag excluding the image name
tag := latest

# To build the main docker image with the given name and tag
all: .built_$(name)_$(tag)

# .build_* are dummy hidden files to avoid building the image repeatedly
.built_$(name)_%: $(src_files)
	@docker build -t "$(name):$*" . && touch $@

# Remove the dummy hidden files that would otherwise prevent the docker images from being rebuilt
clean:
	@rm -rf .built_*

.PHONY: all clean