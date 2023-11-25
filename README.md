# E-Quiz

E-Quiz is a modern and flexible assessment tool designed to make online exams programmable. It is a containerization of Moodle, a popular open-source learning management system, along with other supporting applications. The goal of E-Quiz is to provide instructors with complete control over the learning management system needed to program online exams for their courses. 

# Why?

Although there are plenty of interactive course materials available, most schools still rely on paper exams. Creating an online exam for various courses often requires specific software packages, which can be challenging for teachers who lack control over their school's central learning management system (LMS). Even if these tools can be installed, relying solely on the LMS can limit a teacher's ability to effectively develop and backup exams on their personal computer.

The E-Quiz repository includes a Helm chart, which allows for easy deployment of the system as well as Docker files for building images that support E-Quiz. This means that instructors can quickly and easily set up their own assessment environment without having to worry too much about the technical details of deployment and configuration.

## Requirements

E-Quiz

- uses [Docker](node/k8s/README.md) to build docker images
- and run the containers in a [Kubernetes](node/k8s/README.md) cluster.

See [how to set up a kubernetes node](node/README.md) for development on your local computer.

## Usage

To deploy equiz:

1. Git pull the repository to a node in the kubernetes.
2. At the repository root:
    a. Optionally, run `make test` to dry run a deployment and review the manifest.
    b. Run `make` to deploy.
3. Access the moodle instance at `http://localhost:80/equiz/`.

To customize the deployment, you can use the following make commands from the [Makefile](Makefile):

1. Run `make config` to generate the distribution directory `dist` based on the configuration file `config.yaml.j2`.
    - If the file does not exist, it will be created using the default file [default-config.yaml.j2](default-config.yaml.j2).
    - Edit the configuration file as a Jinja2 template to configure the values of the E-Quiz Helm charts and subcharts.
    - For production environments:
        1. Update the secrets in the configuration and adjust the host/route settings. To use HTTPS, obtain a certificate from Let's Encrypt as described in [template/certificate](template/certificate).
        2. Set the resource limits appropriately based on the demand and available resources. You can refer to [prod-config.yaml.j2](prod-config.yaml.j2) for a sample configuration.
2. Run `make upgrade` to deploy the configured E-Quiz.
3. To clean up everything, run `make clean`.
4. After the deployment, use `make shell` to attach a shell and access the files in [`dist/attach`](template/attach) within the `phpfpm` container at `/attach`. This allows you to run scripts as the `www-data` user.

*Note:*
- Running any of these commands will rerun `make config`, which generates the distribution folder and overwrites existing files in the folder. If you have made manual edits, navigate to the distribution folder and run the command without running `make config` to preserve your changes.
- If you need to switch between configurations or distributions, you can customize the [Makefile](Makefile) to set the configuration and distribution paths according to your requirements.
- To customize how to attach a shell to phpfpm container, you can edit [`template/attach/init.sh`](template/attach/init.sh) and add files to `template/attach` to suit your specific needs.

## Performance

The load test results for Moodle are presented below, which were generated using a test course and JMeter test plan. To set up the test course, the [script](template/sbin/setup_testcourse.sh.j2) was utilized. The test results showcase the performance of Moodle under different user loads:

- [Test results for 100 users](https://ccha23.github.io/e-quiz/100_1)
- [Test results for 500 users](https://ccha23.github.io/e-quiz/500_1)
- [Test results for 1000 users](https://ccha23.github.io/e-quiz/1000_1)