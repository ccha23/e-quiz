{{/*
Expand the name of the chart.
*/}}
{{- define "equiz.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "equiz.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "equiz.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "equiz.labels" -}}
helm.sh/chart: {{ include "equiz.chart" . }}
{{ include "equiz.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "equiz.selectorLabels" -}}
app.kubernetes.io/name: {{ include "equiz.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "equiz.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "equiz.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{- define "equiz.release" -}}
{{- .Release.Name }}-equiz
{{- end }}

{{- define "equiz.phpfpminit.env" -}}
configMapRef:
  name: {{ include "equiz.release" . }}-phpfpminit-env
{{- end }}

{{- define "equiz.phpfpminit.secret" -}}
secretRef:
  name: {{ include "equiz.release" . }}-phpfpminit-secret
{{- end }}

{{- define "equiz.mariadb.env" -}}
configMapRef:
  name: {{ include "equiz.release" . }}-mariadb-env
{{- end }}

{{- define "equiz.mariadb.secret" -}}
secretRef:
  name: {{ include "equiz.release" . }}-mariadb-secret
{{- end }}

{{- define "equiz.maxima.secret" -}}
secretRef:
  name: {{ include "equiz.release" . }}-maxima-secret
{{- end }}

{{- define "equiz.etc" -}}
name: etc
configMap:
  name: {{ include "equiz.release" . }}-etc
{{- end }}


{{- define "equiz.parse" -}}
{{- range (index $ 1) }}
{{- if (hasKey . "<") }}
  {{- include (index . "<") (index $ 0) | nindent 0 }}
{{- else }}
- 
{{- range $k, $v := . }}
  {{- if eq $k "+" }}
    {{- include $v (index $ 0) | nindent 2 }}
  {{- else }}
    {{- $k | nindent 2 }}:
      {{- $v | toYaml | nindent 4 }}
  {{- end }}
{{- end }} 
{{- end }}
{{- end }}
{{- end }}

{{- define "equiz.mysql" -}}
name: mysql
persistentVolumeClaim: 
  claimName: {{ default 
      (printf "%s-mysql" (include "equiz.release" .)) 
      .Values.global.existingPvc.mysql }}
{{- end }}

{{- define "equiz.html" -}}
name: html
persistentVolumeClaim:
  claimName: {{ default 
      (printf "%s-html" (include "equiz.release" .)) 
      .Values.global.existingPvc.html }}
{{- end }}

{{- define "equiz.moodledata" -}}
name: moodledata
persistentVolumeClaim:
  claimName: {{ default 
      (printf "%s-moodledata" (include "equiz.release" .)) 
      .Values.global.existingPvc.moodledata }}
{{- end }}

{{- define "equiz.html.init" -}}
name: html
image: {{ .Values.global.htmlImage }}
imagePullPolicy: Always
volumeMounts:
  - name: html
    mountPath: /output
{{- end }}

{{- define "equiz.phpfpm.volumeMounts" -}}
- name: etc
  mountPath: /usr/local/etc/php/php.ini
  subPath: php.ini
- name: etc
  mountPath: /usr/local/etc/php-fpm.d/zzz_custom.conf
  subPath: php-fpm.conf
- name: html
  mountPath: /var/www/html
- name: moodledata
  mountPath: /var/www/moodledata
{{- end }}

{{- define "equiz.phpfpm.init" -}}
name: phpfpminit
image: {{ .Values.global.phpfpminitImage }}
imagePullPolicy: Always
volumeMounts:
  {{- include "equiz.phpfpm.volumeMounts" . | nindent 2 }}
envFrom:
  - {{- include "equiz.phpfpminit.env" . | nindent 4 }}
  - {{- include "equiz.phpfpminit.secret" . | nindent 4 }}
{{- end }}