#!/usr/bin/env -S bash -euo pipefail

psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" --quiet --set ON_ERROR_STOP=1 $(for schema in schemas/*.sql; do echo --file "$schema"; done)
