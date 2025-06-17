# Docker

The Makefile in the current directory is for installing and configuring Docker on an Ubuntu system. It uses the `apt-get` package manager to install the necessary Docker packages, including `docker-ce`, `docker-ce-cli`, `containerd.io`, `docker-buildx-plugin`, and `docker-compose-plugin`. 

The Makefile also includes targets for uninstalling Docker and removing all data, as well as creating a Docker group and granting permissions to the current user. Additionally, the Makefile includes a `config` target for configuring APT sources to download Docker packages, and a `private-registry` target to configure Docker for use with a local insecure registry (e.g., MicroK8s).

## Usage

To use the provided Makefile, simply navigate to the directory containing the Makefile and run `make` or `make all` to install and set up Docker. You can also run one of the following commands:

- `make config`: Configures APT sources to download Docker packages.
- `make install`: Installs Docker packages on the system.
- `make group`: Creates a Docker group and grants permissions to the current user.
- `make uninstall`: Removes all Docker packages and data, including images, containers, and volumes.
- `make private-registry`: Configures Docker to allow the insecure registry at `localhost:32000` (required for MicroK8s private registry integration).

Making `all` is equivalent to running `make config install group`.

## Reference

Before using the Makefile, it's important to carefully review the code and ensure that it meets your requirements. Additionally, it's recommended to review the Docker documentation and test thoroughly before using Docker in a production environment. 

For more information on how to use Docker and its various features, please refer to the official Docker documentation: https://docs.docker.com/. The documentation provides detailed information on how to use Docker, including how to create and run containers, manage images, and configure Docker networking and storage.