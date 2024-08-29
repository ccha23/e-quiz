namespace = certificate
cm_namespace = cert-manager

all: letsencrypt.production

# Add the myca issuer and deploy a welcome page that requests a certificate from the issuer.
myca: namespace add_cm.myca-ss-issuer add_cm.myca-certificate add_cm.myca-issuer ready.myca-issuer add.page clean.ingress add.myca-ingress

# Add the letsencrypt issuer and a welcome page that requests a certificate from the issuer.
letsencrypt.%: namespace add.page clean.ingress
	$(MAKE) add_cm.letsencrypt-$*-issuer && \
	$(MAKE) ready.letsencrypt-$*-issuer && \
	$(MAKE) add.letsencrypt-$*-ingress

# Get the myca certificate
myca.crt: namespace add.myca-issuer add.myca-certificate
	@echo "Retrieving myca certificate to $(CURDIR)/myca.crt...\n"
	kubectl get secret -n $(namespace) myca-key-pair -o jsonpath='{.data.ca\.crt}' | tee ./myca.crt | base64 -d

# Create the namespace if it does not exist
namespace:
	@if ! kubectl get namespace $(namespace) >/dev/null 2>&1; then \
        echo "Creating namespace $(namespace)"; \
        kubectl create namespace $(namespace); \
    else \
        echo "Namespace $(namespace) already exists"; \
    fi

# Remove the namespace
# NOTE:
#   - Helm deployments and other resources created under the namespace will be removed.
rm.namespace:
	@if kubectl get namespace $(namespace) >/dev/null 2>&1; then \
		echo "Removing namespace $(namespace)..."; \
		kubectl delete namespace $(namespace); \
    fi

add_cm.%:
	@echo "Applying $* to cert-manager namespace Kubernetes..."; \
	kubectl apply -f $*.yaml -n $(cm_namespace)

add.%:
	@echo "Applying $* to Kubernetes..."; \
	kubectl apply -f $*.yaml -n $(namespace)
	
ready.%:
	@echo "Waiting for $* to be ready..."; \
	kubectl wait --for=condition=Ready=true -f $*.yaml

# Remove the page from the Kubernetes
rm.%:
	@if ! kubectl get -f $*.yaml >/dev/null 2>&1; then \
        echo "No resources from $*.yaml"; \
    else \
		echo "Deleting objects defined in $*.yaml from Kubernetes..."; \
		kubectl delete -f $*.yaml; \
    fi

clean.ingress: rm.letsencrypt-staging-ingress rm.letsencrypt-production-ingress rm.myca-ingress
clean.myca: rm.myca-ingress rm.myca-issuer rm.myca-certificate
clean.letsencrypt.%: 
	@$(MAKE) rm.letsencrypt-$*-ingress && \
	$(MAKE) rm.letsencrypt-$*-issuer
clean: clean.myca clean.letsencrypt.staging clean.letsencrypt.production rm.namespace

.PHONY: namespace clean all rm.% add.% add_cm.% clean.% ready.% letsencrypt.% myca