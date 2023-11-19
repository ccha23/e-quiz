# Create a Test Node

E-Quiz can be deployed from a node running an Ubuntu system with `make`, `docker`, and `k8s` installed. For testing and development, use [Multipass](https://multipass.run/) to setup a Ubuntu virtual machine:

- [Shell script for Linux/Mac](create_node.sh)
- [Powershell script for Windows](create_node.ps1)

*Note:*
- Modify the script for the desired configurations. Ensure the node has adequate memory and resources recommended for MicroK8s installation. Otherwise, the installation may get stuck, in which case you would need to add more resources and uninstall/purge Microk8s before reinstalling it again.

- If the installation is successful, the node should starts running and the script should print a command to ssh into the node from the host. The script installed and configured the Avahi daemon to facilitate device discovery and communication on a local network via mDNS/DNS-SD protocol.

- A convenient way to manage the VM is to use the  [VSCode](https://code.visualstudio.com/) on the host with the extensions for [remote-ssh](https://code.visualstudio.com/docs/remote/ssh), [kubernetes](https://code.visualstudio.com/docs/azure/kubernetes), and [docker](https://code.visualstudio.com/docs/containers/overview).

- To reinstall the node, run the command
    ```
    multipass delete equiz && multipass purge
    ```
    where equiz is the instance name to remove.

Access the node and git clone the current repository. Run the command from the root of the repository to install Microk8s and Docker:

```
make k8s
make docker
```


*Note:*
- Restart the node for some changes to take effect:
    ```
    multipass restart equiz
    ```
- If the installation fails due to insufficient resources or other reasons, refer to the Makefiles in the [docker](docker) and [k8s](k8s) folders for the commands to clean up the previous installation before reinstalling.
- `docker` is not required for nodes not involved in building the e-quiz Docker image.


