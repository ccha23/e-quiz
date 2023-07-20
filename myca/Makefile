all: add show

# Add the cluster issuer to the Kubernetes
add: add.issuer add.certificate
add.%:
	@echo "Applying $*.yaml to Kubernetes..."
	kubectl apply -f $*.yaml --wait

# Remove the cluster issuer from the Kubernetes
clean: rm.issuer rm.certificate
rm.%:
	@echo "Deleting objects defined in $*.yaml to Kubernetes..."
	kubectl delete -f $*.yaml

# Status 
get: get.issuer get.certificate
get.%:
	@echo "Applying $*.yaml to Kubernetes..."
	kubectl get -f $*.yaml --watch

# Show the certificate
show:
	@kubectl wait --for=condition=Ready=true -f certificate.yaml && \
	echo "Retrieving myca certificate to $(CURDIR)/myca.crt...\n" && \
	kubectl get secret -n cert-manager myca-key-pair -o jsonpath='{.data.ca\.crt}' | tee ./myca.crt | base64 -d

.PHONY: clean all rm add issuer get