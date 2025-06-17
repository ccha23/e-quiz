# Makefile for installing and configuring Docker
# See https://docs.docker.com/

# Packages to be installed
packages := docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Install Docker and configure APT sources
all: config install group

config:
	@echo "Configuring APT sources..."
	sudo apt-get update
	sudo apt-get install ca-certificates curl gnupg
	sudo install -m 0755 -d /etc/apt/keyrings
	curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
	sudo chmod a+r /etc/apt/keyrings/docker.gpg
	echo \
	"deb [arch="$$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
	"$$(. /etc/os-release && echo "$$VERSION_CODENAME")" stable" | \
	sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker packages
install:
	@echo "Installing Docker packages..."
	sudo apt-get update && \
	sudo apt-get install $(packages)

# Uninstall Docker packages and remove data
uninstall:
	@echo "Uninstalling Docker packages and removing data..."
	sudo apt-get purge $(packages)
	@echo "Cleaning up..."
	sudo rm -fr /var/lib/docker /var/lib/containerd /etc/docker

# Create a group for Docker and add current user to it, granting permissions
group:
	@echo "Creating group and granting permissions..."
	sudo groupadd -f docker && \
	sudo usermod -aG docker $$USER && \
	echo "Re-login for the change to take effect."

# Configure Docker to allow insecure registry for MicroK8s private registry
private-registry:
	@echo "Configuring Docker to allow insecure registry at localhost:32000..."
	@if [ ! -f /etc/docker/daemon.json ]; then \
		echo '{ "insecure-registries": ["localhost:32000"] }' | sudo tee /etc/docker/daemon.json > /dev/null; \
	else \
		if ! command -v jq >/dev/null 2>&1; then \
			echo "jq is required but not installed. Please install jq first."; \
			exit 1; \
		else \
			if ! sudo jq empty /etc/docker/daemon.json >/dev/null 2>&1; then \
				echo "/etc/docker/daemon.json is not a valid JSON file. Aborting."; \
				exit 1; \
			fi; \
			sudo jq 'if .["insecure-registries"] then .["insecure-registries"] |= (if type=="array" then . + ["localhost:32000"] | unique else ["localhost:32000"] end) else . + {"insecure-registries": ["localhost:32000"]} end' /etc/docker/daemon.json | sudo tee /etc/docker/daemon.json.tmp > /dev/null && \
			sudo mv /etc/docker/daemon.json.tmp /etc/docker/daemon.json; \
		fi; \
	fi
	@echo "Restarting Docker..."
	sudo systemctl restart docker
	@echo "Docker is now configured to use the MicroK8s private registry (localhost:32000)."

# Declare all targets as .PHONY
.PHONY: all config install group uninstall private-registry
