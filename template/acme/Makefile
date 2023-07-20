namespace := welcome-page

all: add.page

namespace:
	@if ! kubectl get namespace $(namespace) >/dev/null 2>&1; then \
        echo "Creating namespace $(namespace)"; \
        kubectl create namespace $(namespace); \
    else \
        echo "Namespace $(namespace) already exists"; \
    fi

# Add welcome page
add.page: namespace issuer
	@echo "Applying page.yaml to Kubernetes..."
	kubectl apply -f page.yaml -n $(namespace)

# Get welcome page
get.page:
	@echo "Getting issuer cluster issuers..."
	kubectl get -f page.yaml -n $(namespace)

# Remove the page from the Kubernetes
rm.page:
	@echo "Deleting objects defined in page.yaml from Kubernetes..."
	kubectl delete -f page.yaml -n $(namespace)

# Ensure issuers are ready
issuer: add.issuer
	@while true; do \
		kubectl get -f issuer.yaml \
		-o jsonpath='{.items[*].status.conditions[?(@.type=="Ready")]}' \
		| grep -q "False" && \
		echo "Not all resources are ready" \
		|| { echo "All resources are ready"; break; }; \
		sleep 1; \
	done

# Remove the issuer and page from the Kubernetes
clean: rm.issuer
	@echo "Deleting the namespace $(namespace)..."
	kubectl delete namespace $(namespace)

# Add the cluster issuer to the Kubernetes
add.issuer:
	@echo "Applying issuer.yaml to Kubernetes..."
	kubectl apply -f issuer.yaml

# Get the cluster issuer to the Kubernetes
get.issuer:
	@echo "Getting cluster issuers..."
	kubectl get -f issuer.yaml

# Remove the cluster issuer from the Kubernetes
rm.issuer:
	@echo "Deleting objects defined in issuer.yaml from Kubernetes..."
	kubectl delete -f issuer.yaml

.PHONY: clean all issuer rm.% add.% get.%