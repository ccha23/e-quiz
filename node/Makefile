# Makefile for installing docker and k8s in an ubuntu system with make installed

# Default target: Install both docker and k8s
all: docker k8s

# Setup docker
docker: docker.all
docker.%:
	@cd docker && make $*

# Setup k8s
k8s: k8s.all
k8s.%:
	@cd k8s && make $*

.PHONY: docker.% k8s.%