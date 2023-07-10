# source files for building the image
src_files := $(wildcard sbin/*) Dockerfile
# docker image name
name := phpfpm
# docker image tag excluding the image name
tag := latest
# docker registry
registry := localhost:32000

# To build the main docker image with the given name and tag
all: .built_$(name)_$(tag)

# .build_* are dummy hidden files to avoid building the image repeatedly
.built_$(name)_%: $(src_files)
	@docker build --target=prod -t "$(registry)/$(name):$*" . && \
	docker push "$(registry)/$(name):$*" && \
	docker build --target=init -t "$(registry)/$(name)init:$*" . && \
	docker push "$(registry)/$(name)init:$*" && \
	docker build --target=debugger -t "$(registry)/$(name)debugger:$*" . && \
	docker push "$(registry)/$(name)debugger:$*" && \
	touch $@

# Remove the dummy hidden files that would otherwise prevent the docker images from being rebuilt
clean:
	@rm -rf .built_*

.PHONY: all clean