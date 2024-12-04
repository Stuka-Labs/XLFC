gcloud logging read \
  'resource.type="cloud_run_revision"
   resource.labels.service_name="userinfo"
   resource.labels.location="us-central1"
   severity>=DEFAULT
   timestamp>="2024-12-02T00:00:00Z"' \
  --order=desc \
  --limit=10