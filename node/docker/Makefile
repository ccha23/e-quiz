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
	newgrp docker && \
	echo

# Declare all targets as .PHONY
.PHONY: all config install group uninstall
