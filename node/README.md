# Node Requirements

E-Quiz can be deployed from a node running an Ubuntu system with `make`, `docker`, and `k8s` installed. If you're using a different operating system, you can run an Ubuntu virtual machine using [Multipass](https://multipass.run/).

## Basic setup

To create a Multipass instance with 4GB of memory and 20GB of disk space, run the following command:

```
multipass launch --name my-instance --mem 4G --disk 20G
```

In this command:

- `multipass launch` creates a new instance.
- `--name my-instance` specifies the instance name (replace `my-instance` with your preferred name).
- `--mem 4G` allocates 4GB of memory.
- `--disk 20G` allocates 20GB of disk space.

*Note: Ensure your system has adequate memory and resources, following the recommendations for MicroK8s installation. Otherwise, the installation of microk8s may get stuck, in which case you would need to add more resources and uninstall/purge microk8s before reinstalling it again.*

After creating and running the instance, set the root password by the command `passwd` and install `make` using the following command:

```
sudo apt update && \
sudo apt install make
```

Git clone the current repository and run the command from the root of the repository:

```
# To install microk8s
make k8s
# To install docker
make docker
```

Reboot ubuntu for the docker/k8s groups to take effect:

```
multipass restart my-instance
```

*Note:*
- If the installation fails due to insufficient resources or other reasons, you can try uninstalling and reinstalling using the other makefile commands. Refer to the Makefiles in the [docker](docker) and [k8s](k8s) folders for more detailed instructions.
- Note that `docker` is not required for other nodes in the Kubernetes cluster that are not involved in building the e-quiz Docker image.

## Optional Setup

To enable access to the Ubuntu VM from the host or other devices on the same network, install and configure the Avahi daemon, which facilitates device discovery and communication on a local network via mDNS/DNS-SD protocol:

```
sudo apt install avahi-daemon avahi-utils
```

Edit the Avahi configuration file, uncomment the `domain-name` line, and restart the daemon:
Edit the Avahi configuration file to set the desired domain:

```
sudo nano /etc/avahi/avahi-daemon.conf
# Remove the '#' before 'domain-name=local'
sudo systemctl restart avahi-daemon
```

To access the Ubuntu VM using SSH:

`ssh ubuntu@my-instance.local`

A more convenient way to manage the VM is to use the  [VSCode](https://code.visualstudio.com/) on the host with the [remote-ssh](https://code.visualstudio.com/docs/remote/ssh) extension. There are other extensions useful for managing [kubernetes](https://code.visualstudio.com/docs/azure/kubernetes) and [docker](https://code.visualstudio.com/docs/containers/overview).

