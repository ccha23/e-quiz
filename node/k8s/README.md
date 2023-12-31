# MicroK8s

The provided Makefile is a tool for installing and configuring MicroK8s on an Ubuntu system. MicroK8s is a lightweight and fast Kubernetes distribution that can be used for development and testing. 

## Usage

The Makefile includes several targets for installing and configuring MicroK8s, including:

- `install`: Installs MicroK8s and aliases for `kubectl` and `helm`.
- `uninstall`: Uninstalls MicroK8s and removes all data.
- `addons`: Enables all specified addons.
- `group`: Creates a group for MicroK8s and adds the current user to it, granting permissions.
- `network`: Apply network configurations such as iptable.

The `all` target runs the targets `install addons group` in sequence, making it easy to install and configure MicroK8s with a single command. 

## Reference

Before running the Makefile, it's recommended to review the code and ensure that it meets your requirements. Additionally, it's important to carefully review the MicroK8s documentation and test thoroughly before using MicroK8s in a production environment. 

For more information on how to use MicroK8s and its various features, please refer to the official MicroK8s documentation: https://microk8s.io/docs/getting-started. The documentation provides detailed information on how to use MicroK8s, including how to create and manage Kubernetes clusters, deploy applications, and configure MicroK8s networking and storage.