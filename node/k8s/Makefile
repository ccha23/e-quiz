# Makefile for setting up MicroK8s with addons and permissions
# See https://microk8s.io/docs/getting-started

# version 
# See https://microk8s.io/docs/release-notes
channel := 1.32/stable

# Addons to be enabled
addons_list := cert-manager dashboard ingress registry hostpath-storage community

# Define the user variable to get the current user
# This is used to set permissions for the MicroK8s group
user := $(shell whoami)

# Default target runs all other targets
all: install alias addons network

# Install MicroK8s
install:
	@echo "Installing MicroK8s..."
	@sudo snap install microk8s --classic --channel=$(channel) && \
	sudo microk8s status --wait-ready

# Create aliases for kubectl and helm, and enable auto-completion
alias:
	@echo "Creating aliases for kubectl and helm..."
	@sudo snap alias microk8s.kubectl kubectl && \
	sudo snap alias microk8s.helm3 helm

# Update MicroK8s to the version in the specified channel
# Apply this to every node (with microk8s already installed) one by one,
# for the control plane nodes first.
update:
	@echo "Stopping MicroK8s before update..."
	@sudo microk8s stop
	@echo "Updating MicroK8s..."
	@sudo snap refresh microk8s --channel=$(channel)
	@echo "Starting MicroK8s after update..."
	@sudo microk8s start
	@sudo microk8s status --wait-ready

# To make it persistent
# apt install iptables-persistent
network:
	@echo "To permit traffic between the VM and host..."
	@sudo iptables -P FORWARD ACCEPT

# Uninstall MicroK8s and remove all data
uninstall:
	@echo "Uninstalling MicroK8s..."
	@sudo snap remove microk8s --purge

# Enable/update all specified addons
# Do it once per cluster
addons:
	@echo "Enabling addons..."
	@for addon in $(addons_list); do \
		sudo microk8s disable $$addon; \
		sudo microk8s enable $$addon \
		|| { echo "Error enabling $$addon"; break; }; \
	done

# Enable bash auto-completion for kubectl
auto-completion:
	@echo "Checking for bash-completion..."
	@if ! dpkg -s bash-completion >/dev/null 2>&1; then \
		echo "bash-completion not found. Please install it first"; \
		exit 1; \
	fi
	@echo "Enabling kubectl auto-completion..."
	@sudo microk8s.kubectl completion bash | sudo tee /etc/bash_completion.d/kubectl > /dev/null
	@sudo microk8s.kubectl completion bash | sudo tee /etc/bash_completion.d/microk8s.kubectl > /dev/null
	@if ! grep -q '/etc/bash_completion' $$HOME/.bashrc; then \
		echo "source /etc/bash_completion" >> $$HOME/.bashrc; \
	fi
	@echo "Auto-completion enabled. Please run 'source $$HOME/.bashrc' or relogin to take effect."

# Create a group for MicroK8s for non-root user to manage microk8s
group:
	@echo "Creating group and granting permissions..." && \
	sudo groupadd -f microk8s && \
	sudo usermod -aG microk8s $(user) && \
	echo "Run 'newgrp microk8s' or log out and log back in to apply group changes."

.PHONY: all addons alias auto-completion network install uninstall setup group