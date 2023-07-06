FROM alpine:3.18

# Update the package manager and install Python 3.11 and pip
RUN apk add python3 py3-pip su-exec bash

# Install required python packages
RUN pip install --root-user-action=ignore --no-cache-dir \
    jinja2==3.1.* \
    pyyaml==6.* \
    ;

# Create a non-root user named "equser"
RUN adduser -D equser && \
    mkdir /dist /template && \
    chown -R equser:equser /dist /template

USER equser

# Set the working directory to /app
WORKDIR /app

# Copy application code to the container
COPY --chown=equser:equser app/ /app/

# Set the default command to run when the container starts
CMD ["/usr/bin/python", "/app/main.py"]

