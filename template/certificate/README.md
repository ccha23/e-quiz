# TLS Certificates for HTTPS

This documentation provides steps to install 

- a self-signed CA certificate in the Kubernetes cluster to test run a service with TLS, and
- a letsencrypt certificate for production. 

## Installation of self-signed CA certificate

Before running the following commands, make sure you have install microk8s with ingress and cert-manager addons, and set the alias `kubectl` for `microk8s.kubectl` according to the commands in the folder [k8s](../k8s).

To add the myca issuer and deploy a welcome page that requests a certificate from the issuer, run the following command:

```sh
make myca
```

Using the private browsing mode, you can navigate to the website that uses the self-signed certificate. To avoid security warnings, you can install the certificate on the device as follows. 

1. Get the myca certificate, run the following command:

    ```sh
    make myca.crt
    ```

2. On the device where the certificate is to be installed, add the exported CA certificate `myca.crt` to your OS. E.g., if you are using Ubuntu, use the following command:
    ```sh
    sudo cp myca.crt /usr/local/share/ca-certificates/myca.crt && \
    sudo update-ca-certificates
    ```
    For more information, refer to the [official documentation](https://help.ubuntu.com/community/OpenSSL#Installing_a_CA_Certificate_in_Ubuntu) for installing a CA certificate in Ubuntu.

3. Open the web browser and manually add the certificate to your browser's trusted certificates list. E.g., if you are using Firefox, follow the steps outlined in the [documentation for FireFox](https://support.mozilla.org/en-US/kb/setting-certificate-authorities-firefox):

    - Enter `about:preferences#privacy`` in the address bar.
    - Click the `View Certificates...` option.
    - Select Authorities tab, and then click `Import...``.
    - Select the file `myca.crt` to import, and then click Open.
    - Click OK, and then close the window.

4. Finally, navigate to the website that uses the certificate. The web browser should now trust the certificate and display the website without any security warnings.


## Installation of Let's Encrypt certificate

Before running the following command, make sure you have provided a valid email address to the config.yaml file. To add the Letsencrypt issuer and a welcome page that requests a certificate from the issuer, run the following command:

```sh
make letsencrypt
```

Navigate to the website that uses the certificate. The web browser should trust the certificate and display the website without additional installation.


## Implementation

Details on how to set up the letsencrypt certificate can be found in the following link:
- [Let's Encrypt Certificates for ingress](https://microk8s.io/docs/addon-cert-manager#lets-encrypt-certificates)

The `myca-issuer.yaml` file defines a ClusterIssuer called "myca" that can issue certificates based on a self-signed root CA. For more details, refer to the following links:

- [Configuring a CA](https://cert-manager.io/docs/configuration/ca/)
- [Self-Signed Certificates](https://cert-manager.io/docs/configuration/selfsigned/)

