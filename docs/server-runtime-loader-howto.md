# Server Runtime Loader How-To

This guide documents the runtime config loader used by the server-only code.

## What it loads

Runtime config is assembled from YAML files in `src/config`:

- `runtime-service-config.base.yaml`
- `runtime-service-config.prod.yaml`
- `runtime-service-config.sit.yaml`

The loader merges `base` + environment overrides, and then merges region overrides
if present under `regions`.

## Environment selection

The environment and region are resolved in this order:

1. `RUNTIME_ENV` + optional `REGION`
2. A `.runtime-env-config.yaml` file (from a short list of known paths)
3. Default to `prod` / `default`

## Safe ENV references in YAML

Any object shaped as `{ env: "NAME" }` will be replaced by `process.env.NAME`
when the YAML is parsed. If the env var is missing, the loader logs a warning.

Example:

```yaml
storage:
  credentials:
    accessKeyId: { env: ACCESS_KEY_ID }
    secretAccessKey: { env: SECRET_ACCESS_KEY }
```

## Storage config layout (reference)

This repo expects a `storage` object for server-side storage clients:

```yaml
storage:
  provider: s3 | gcs | oss | vercel
  bucket: my-bucket
  region: ap-southeast-1
  endpoint: https://s3.example.com
  prefix: public
  publicBaseUrl: https://cdn.example.com

  credentials:
    accessKeyId: { env: ACCESS_KEY_ID }
    secretAccessKey: { env: SECRET_ACCESS_KEY }
    sessionToken: { env: SESSION_TOKEN }

  gcs:
    projectId: my-gcp-project
    bucket: my-gcs-bucket
    publicBaseUrl: https://storage.googleapis.com/my-gcs-bucket
    credentialsJson: { env: GCP_SERVICE_ACCOUNT_JSON }

  oss:
    endpoint: https://oss-cn-shanghai.aliyuncs.com
    bucket: my-oss-bucket
    region: cn-shanghai
    publicBaseUrl: https://my-oss-bucket.oss-cn-shanghai.aliyuncs.com

  vercel:
    token: { env: BLOB_READ_WRITE_TOKEN }
    access: public
```

## R2 credentials (AK/SK)

R2 is S3-compatible, so it uses the same Access Key / Secret Access Key pair:

- `ACCESS_KEY_ID` → R2 Access Key ID
- `SECRET_ACCESS_KEY` → R2 Secret Access Key
- `SESSION_TOKEN` is optional (usually not needed for R2)

For R2-specific settings, keep `storage.r2.endpoint` pointed at
`https://<account-id>.r2.cloudflarestorage.com` and set `storage.r2.region`
to `auto`.
