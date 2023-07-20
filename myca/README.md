# Self-signed CA certificate

This documentation provides steps to install a self-signed CA certificate in the Kubernetes cluster to test a service with TLS from the web browser of another device. You can use the Makefile in this folder to complete the installation.

## Installation

Before proceeding with the installation, ensure that cert-manager is installed on your Kubernetes cluster. If not, follow the [documentation](https://cert-manager.io/docs/installation/kubernetes/) to install cert-manager on your cluster.

1. Create a self-signed root CA by creating a cluster issuer using the following command:

    ```sh
    make add
    ```

2. Export the CA certificate to a file named `myca.crt` using the following command:

    ```sh
    make get
    ```

On the device where the certificate is to be installed:

1. Add the exported CA certificate `myca.crt` to your OS. E.g., if you are using Ubuntu, use the following command:
    ```sh
    sudo cp myca.crt /usr/local/share/ca-certificates/myca.crt \
	    && update-ca-certificates
    ```
    For more information, refer to the [official documentation](https://help.ubuntu.com/community/OpenSSL#Installing_a_CA_Certificate_in_Ubuntu) for installing a CA certificate in Ubuntu.

2. Open the web browser and manually add the certificate to your browser's trusted certificates list. E.g., if you are using Firefox, follow the steps outlined in the [documentation for FireFox](https://support.mozilla.org/en-US/kb/setting-certificate-authorities-firefox).

3. Finally, navigate to the website that uses the certificate. The web browser should now trust the certificate and display the website without any security warnings.

## Implementation

The `myca.crt` file defines a ClusterIssuer called "myca" that can issue certificates based on a self-signed root CA. For more details, refer to the following links:

- [Configuring a CA](https://cert-manager.io/docs/configuration/ca/)
- [Self-Signed Certificates](https://cert-manager.io/docs/configuration/selfsigned/)