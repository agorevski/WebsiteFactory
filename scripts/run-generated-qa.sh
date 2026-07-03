#!/usr/bin/env bash
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

REPORT_ROOT="qa-reports/generated-site"
TIMESTAMP="$(date -u '+%Y%m%dT%H%M%SZ')"
REPORT_DIR="${REPORT_ROOT}/${TIMESTAMP}"

if [[ -e "$REPORT_DIR" ]]; then
  REPORT_DIR="${REPORT_ROOT}/${TIMESTAMP}-$$"
fi

mkdir -p "$REPORT_DIR"

SUMMARY_FILE="${REPORT_DIR}/summary.md"
SITE_URL="${QA_GENERATED_SITE_URL:-http://127.0.0.1:4173}"
HTML_VALIDATOR_ENDPOINT="${HTML_VALIDATOR_URL:-http://127.0.0.1:8888/nu/}"
PREVIEW_TIMEOUT_SECONDS="${QA_GENERATED_PREVIEW_TIMEOUT_SECONDS:-60}"

export LHCI_BASE_URL="$SITE_URL"
export GENERATED_SITE_URL="$SITE_URL"
export PLAYWRIGHT_BASE_URL="$SITE_URL"
export SITE_URL
export STATIC_SITE_URL="$SITE_URL"
export HTML_VALIDATOR_URL="$HTML_VALIDATOR_ENDPOINT"

declare -a CHECK_NAMES=()
declare -a CHECK_STATUSES=()
declare -a CHECK_STDOUTS=()
declare -a CHECK_STDERRS=()
declare -a CHECK_DETAILS=()

FAILURES=0
PREVIEW_PID=""
PREVIEW_USES_PROCESS_GROUP=0

record_check() {
  local name="$1"
  local status="$2"
  local stdout_log="$3"
  local stderr_log="$4"
  local detail="$5"

  CHECK_NAMES+=("$name")
  CHECK_STATUSES+=("$status")
  CHECK_STDOUTS+=("$stdout_log")
  CHECK_STDERRS+=("$stderr_log")
  CHECK_DETAILS+=("$detail")
}

record_failure() {
  FAILURES=$((FAILURES + 1))
}

cleanup() {
  if [[ -n "$PREVIEW_PID" ]]; then
    echo "Stopping Astro preview server (PID ${PREVIEW_PID})..."
    if [[ "$PREVIEW_USES_PROCESS_GROUP" -eq 1 ]]; then
      kill -- "-${PREVIEW_PID}" 2>/dev/null || true
    else
      kill "$PREVIEW_PID" 2>/dev/null || true
    fi
    wait "$PREVIEW_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

write_summary() {
  {
    echo "# Generated Site QA Report"
    echo
    echo "- Created: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    echo "- Report directory: \`${REPORT_DIR}\`"
    echo "- Site URL: \`${SITE_URL}\`"
    echo "- HTML validator URL: \`${HTML_VALIDATOR_ENDPOINT}\`"
    echo
    echo "## Checks"
    echo

    for index in "${!CHECK_NAMES[@]}"; do
      echo "- **${CHECK_STATUSES[$index]}** ${CHECK_NAMES[$index]}"
      echo "  - stdout: \`${CHECK_STDOUTS[$index]}\`"
      echo "  - stderr: \`${CHECK_STDERRS[$index]}\`"
      echo "  - ${CHECK_DETAILS[$index]}"
    done

    echo
    if [[ "$FAILURES" -gt 0 ]]; then
      echo "Result: FAIL (${FAILURES} non-skipped check(s) failed)."
    else
      echo "Result: PASS (no non-skipped checks failed)."
    fi
  } > "$SUMMARY_FILE"
}

run_check() {
  local id="$1"
  local name="$2"
  shift 2

  local stdout_log="${REPORT_DIR}/${id}.stdout.log"
  local stderr_log="${REPORT_DIR}/${id}.stderr.log"

  echo "Running ${name}..."
  "$@" > "$stdout_log" 2> "$stderr_log"
  local status=$?

  if [[ "$status" -eq 0 ]]; then
    record_check "$name" "PASS" "$stdout_log" "$stderr_log" "Command succeeded: $*"
  else
    record_failure
    record_check "$name" "FAIL" "$stdout_log" "$stderr_log" "Command failed with exit code ${status}: $*"
  fi
}

start_preview() {
  local stdout_log="${REPORT_DIR}/preview.stdout.log"
  local stderr_log="${REPORT_DIR}/preview.stderr.log"

  echo "Starting Astro preview server..."
  if command -v setsid >/dev/null 2>&1; then
    setsid npm run qa:generated:serve > "$stdout_log" 2> "$stderr_log" &
    PREVIEW_USES_PROCESS_GROUP=1
  else
    npm run qa:generated:serve > "$stdout_log" 2> "$stderr_log" &
    PREVIEW_USES_PROCESS_GROUP=0
  fi

  PREVIEW_PID=$!
}

wait_for_preview() {
  local stdout_log="${REPORT_DIR}/preview-wait.stdout.log"
  local stderr_log="${REPORT_DIR}/preview-wait.stderr.log"
  local deadline=$((SECONDS + PREVIEW_TIMEOUT_SECONDS))

  echo "Waiting up to ${PREVIEW_TIMEOUT_SECONDS}s for ${SITE_URL}..." > "$stdout_log"
  : > "$stderr_log"

  while [[ "$SECONDS" -lt "$deadline" ]]; do
    if curl --fail --silent --show-error --output /dev/null "$SITE_URL" >> "$stdout_log" 2>> "$stderr_log"; then
      if kill -0 "$PREVIEW_PID" 2>/dev/null; then
        record_check "Astro preview" "PASS" "${REPORT_DIR}/preview.stdout.log" "${REPORT_DIR}/preview.stderr.log" "Preview is reachable at ${SITE_URL}."
      else
        record_failure
        record_check "Astro preview" "FAIL" "${REPORT_DIR}/preview.stdout.log" "${REPORT_DIR}/preview.stderr.log" "Preview command exited before the reachable URL check completed."
      fi
      return 0
    fi

    if ! kill -0 "$PREVIEW_PID" 2>/dev/null; then
      record_failure
      record_check "Astro preview" "FAIL" "${REPORT_DIR}/preview.stdout.log" "${REPORT_DIR}/preview.stderr.log" "Preview command exited before ${SITE_URL} became reachable. Wait logs: ${stdout_log}, ${stderr_log}."
      return 1
    fi

    sleep 1
  done

  record_failure
  record_check "Astro preview" "FAIL" "${REPORT_DIR}/preview.stdout.log" "${REPORT_DIR}/preview.stderr.log" "Timed out waiting for ${SITE_URL}. Wait logs: ${stdout_log}, ${stderr_log}."
  return 1
}

run_html_validation_if_available() {
  local probe_stdout="${REPORT_DIR}/html-validator-probe.stdout.log"
  local probe_stderr="${REPORT_DIR}/html-validator-probe.stderr.log"

  echo "Checking local Nu HTML validator at ${HTML_VALIDATOR_ENDPOINT}..."
  if curl --fail --silent --show-error --max-time 5 --output "$probe_stdout" "$HTML_VALIDATOR_ENDPOINT" 2> "$probe_stderr"; then
    run_check "html-validation" "HTML validation" npm run qa:generated:html
  else
    local instructions="Local Nu HTML validator was not reachable at ${HTML_VALIDATOR_ENDPOINT}. Start a local Nu HTML checker there, or set HTML_VALIDATOR_URL to its local endpoint, then rerun npm run qa:generated:report."
    echo "Skipping HTML validation: ${instructions}"
    record_check "HTML validation" "SKIPPED" "$probe_stdout" "$probe_stderr" "$instructions"
  fi
}

echo "Writing generated-site QA report to ${REPORT_DIR}"

run_check "build" "Workspace build" npm run qa:generated:build

start_preview
wait_for_preview || true

run_check "lhci" "Lighthouse CI" npm run qa:generated:lhci
run_check "playwright-axe" "Playwright/axe smoke checks" npm run qa:generated:playwright
run_check "static-validation" "Static link validation" npm run qa:generated:static
run_html_validation_if_available

write_summary

echo "Generated QA report: ${SUMMARY_FILE}"

if [[ "$FAILURES" -gt 0 ]]; then
  exit 1
fi

exit 0
