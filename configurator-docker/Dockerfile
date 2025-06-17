FROM alpine:3.22.0

# Update the package manager and install Python 3.11 and pip
RUN apk add python3 py3-pip su-exec bash

# Create a non-root user named "equser"
RUN adduser -D equser && \
    mkdir -p /app /dist /template && \
    chown -R equser:equser /app /dist /template

USER equser

# Set the working directory to /app
WORKDIR /app

# Copy application code to the container
COPY --chown=equser:equser app/ /app/

# Install required python packages
RUN python -m venv venv && venv/bin/python -m pip install --no-cache-dir \
    jinja2==3.1.* \
    pyyaml==6.0.* \
    ;

# Set the default command to run when the container starts
CMD ["venv/bin/python", "main.py"]

