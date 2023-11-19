# Makefile for setting up MicroK8s with addons and permissions
# See https://microk8s.io/docs/getting-started

# version 
# See https://microk8s.io/docs/release-notes
channel := 1.28

# Addons to be enabled
addons := cert-manager dashboard ingress registry hostpath-storage

# Default target runs all other targets
all: install addons group network

# Install MicroK8s and aliases for kubectl and helm
install:
	@echo "Installing MicroK8s..."
	@sudo snap install microk8s --classic --channel=$(channel) && \
	sudo microk8s status --wait-ready && \
	sudo snap alias microk8s.kubectl kubectl && \
	sudo snap alias microk8s.helm3 helm

network:
	@echo "To permit traffic between the VM and host..."
	@sudo iptables -P FORWARD ACCEPT

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
	sudo usermod -aG microk8s $$USER && \
	sudo chown -R $$USER ~/.kube && \
	echo "Re-login for the change to take effect."

.PHONY: all install uninstall setup group