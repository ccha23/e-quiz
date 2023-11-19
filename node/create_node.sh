#!/bin/sh
# This script creates a multipass instance with custom settings and provisions it with cloud-init.
# It also generates an SSH key pair and adds the public key to the instance's authorized keys.
#
# Requirements:
# - ssh
# - multipass
# See 
# - https://dev.to/arc42/enable-ssh-access-to-multipass-vms-36p7
# - https://cloudinit.readthedocs.io/en/latest/reference/examples.html

# Set the name and specifications of the instance
name="equiz"
cpus="1"
memory="4G"
disk="20G"

# Set the username and SSH key file
user=$USER
keyfile="$HOME/.ssh/multipass-ssh-key"

# Generate SSH key pair
ssh-keygen -C "$user" -f "$keyfile"

# Launch the Multipass instance with cloud-init
multipass launch -n $name -c $cpus -m $memory -d $disk --cloud-init - <<EOF
groups:
  - microk8s
  - docker

users:
  - default
  - name: $user
    groups: [microk8s, docker]
    shell: /bin/bash
    sudo: ALL=(ALL) NOPASSWD:ALL
    ssh_authorized_keys:
    - $(cat "$keyfile.pub")

package_upgrade: true
packages:
  - make
  - avahi-daemon
  - avahi-utils

runcmd:
  - sudo sed -i 's/#domain=local/domain=local/' /etc/avahi/avahi-daemon.conf
  - systemctl enable avahi-daemon
  - systemctl restart avahi-daemon
EOF

# Display the SSH command to connect to the new instance
echo "To ssh to the new instance, run the command:"
echo "ssh $user@$name.local -i $keyfile -o StrictHostKeyChecking=no"