# E-Quiz

E-Quiz is a modern and flexible assessment tool designed to make online exams programmable. It is a containerization of Moodle, a popular open-source learning management system, along with other supporting applications. The goal of E-Quiz is to provide instructors with complete control over the applications needed to support their courses, making it easy to customize and deploy their own learning management system. 

The E-Quiz repository includes a Helm chart, which allows for easy deployment of the system to Kubernetes, as well as Docker files for building images that support E-Quiz. This means that instructors can quickly and easily set up their own assessment environment without having to worry about the technical details of deployment and configuration. 

With E-Quiz, instructors can create a variety of assessment activities, including quizzes, tests, and exams. The system provides a range of question types, such as multiple choice, short answer, and essay questions, as well as the ability to randomize questions and answers. E-Quiz also includes powerful grading and reporting features, making it easy to track student progress and provide feedback. 

Overall, E-Quiz is a powerful and flexible assessment tool that allows instructors to create engaging and effective online exams. With its containerized architecture and easy deployment options, it is an ideal choice for educators who want complete control over their assessment environment.

## Requirements

- Kubernetes cluster such as microk8s with private registry and nginx ingress controller enabled at localhost:32000.
- Docker and Docker Compose.

## Usage

1. Run `make config` to generate the configuration file `config.yaml.j2` from the default if it does not exist. This file can be edited to configure equiz.
2. Run `make` or `make upgrade` to deploy equiz using Helm.
3. To test the Docker images using Docker Compose, run `make up`.
4. To clean up everything, run `make clean`.

Note: Running any of these commands reruns `make config` to generate the distribution folder, which overwrites any edits made to the files in the folder. To preserve manual edits, navigate to the distribution folder and run the command without running `make config`.