# Makefile for setting up MicroK8s with addons and permissions
# See https://microk8s.io/docs/getting-started

# Addons to be enabled
addons = cert-manager dashboard ingress registry hostpath-storage
channel = 1.27

# Default target runs all other targets
all: install addons group

# Install MicroK8s and aliases for kubectl and helm
install:
	@echo "Installing MicroK8s..."
	@sudo snap install microk8s --classic --channel=$(channel) && \
	sudo microk8s --wait-ready && \
	sudo snap alias microk8s.kubectl kubectl && \
	sudo snap alias microk8s.helm3 helm

# Uninstall MicroK8s and remove all data
uninstall:
	@echo "Uninstalling MicroK8s..."
	@sudo snap remove microk8s --purge

# Enable all specified addons
addons:
	@echo "Enabling addons..."
	@for addon in $(addons); do \
		sudo microk8s enable $$addon \
		|| { echo "Error enabling $$addon"; break; }; \
	done

# Create a group for MicroK8s and add the current user to it, granting permissions
group:
	@echo "Creating group and granting permissions..."
	sudo groupadd -f microk8s && \
	sudo usermod -a -G microk8s $$USER && \
	sudo chown -f -R $$USER ~/.kube && \
	newgrp microk8s

.PHONY: all install uninstall setup group