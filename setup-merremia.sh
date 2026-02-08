#!/bin/bash
# ══════════════════════════════════════════════════════════════
# Merremia Vanuatu — Complete GitHub Setup Script
# ══════════════════════════════════════════════════════════════
#
# This script sets up the full Merremia field data pipeline:
#   1. Creates merremia-field-data repo (data storage)
#   2. Creates merremia-field-collector repo (field PWA app)
#   3. Uploads all files to both repos
#   4. Enables GitHub Pages on the field collector
#   5. Adds the connector + dashboard to the existing dashboard repo
#   6. Prints next steps
#
# PREREQUISITES:
#   - GitHub CLI (gh) installed and authenticated
#     Install: https://cli.github.com
#     Auth:    gh auth login
#
# USAGE:
#   chmod +x setup-merremia.sh
#   ./setup-merremia.sh
#
# ══════════════════════════════════════════════════════════════

set -e

GITHUB_USER=""
DASHBOARD_REPO="merremia-vanuatu-dashboard"
COLLECTOR_REPO="merremia-field-collector"
DATA_REPO="merremia-field-data"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

print_step() { echo -e "\n${CYAN}--- $1 ---${NC}"; }
print_ok() { echo -e "${GREEN} $1${NC}"; }
print_warn() { echo -e "${YELLOW}  $1${NC}"; }
print_err() { echo -e "${RED} $1${NC}"; }

# Step 0: Check prerequisites
print_step "Step 0: Checking prerequisites"

if ! command -v gh &> /dev/null; then
    print_err "GitHub CLI (gh) is not installed."
    echo "  macOS:   brew install gh"
    echo "  Linux:   sudo apt install gh"
    echo "  Then:    gh auth login"
    exit 1
fi

if ! gh auth status &> /dev/null; then
    print_warn "GitHub CLI not authenticated. Running gh auth login..."
    gh auth login
fi

GITHUB_USER=$(gh api user -q .login)
if [ -z "$GITHUB_USER" ]; then
    print_err "Could not detect GitHub username."
    exit 1
fi
print_ok "Authenticated as: $GITHUB_USER"

# Step 1: Create data repository
print_step "Step 1: Creating $DATA_REPO repository"

if gh repo view "$GITHUB_USER/$DATA_REPO" &> /dev/null; then
    print_warn "$DATA_REPO already exists"
else
    gh repo create "$DATA_REPO" --public --description "Field-collected data for Merremia invasive vine monitoring in Vanuatu" --clone=false
    print_ok "Created $DATA_REPO"
fi

TEMP_DATA=$(mktemp -d)
cd "$TEMP_DATA"
git init -b main
git remote add origin "https://github.com/$GITHUB_USER/$DATA_REPO.git"

cat > README.md << READMEEOF
# Merremia Field Data

Field-collected data from the Merremia invasive vine monitoring project in Vanuatu.

## Structure

\`\`\`
records/       -> Individual observation records (JSON)
photos/        -> Field photos (compressed JPEG)
data/          -> Aggregated data files
\`\`\`

## Links

- [Field Collector](https://$GITHUB_USER.github.io/$COLLECTOR_REPO/)
- [Dashboard](https://$GITHUB_USER.github.io/$DASHBOARD_REPO/)
READMEEOF

mkdir -p records photos data
echo '[]' > data/all-records.json
echo 'id,timestamp,latitude,longitude,accuracy,island,siteName,species,count,threatLevel,coverageArea,observer,notes,photoCount' > data/all-records.csv
touch records/.gitkeep photos/.gitkeep

git add -A
git commit -m "Initialize Merremia field data repository"
git push -u origin main
print_ok "$DATA_REPO initialized"
cd ~
rm -rf "$TEMP_DATA"

# Step 2: Create field collector repository
print_step "Step 2: Creating $COLLECTOR_REPO repository"

if gh repo view "$GITHUB_USER/$COLLECTOR_REPO" &> /dev/null; then
    print_warn "$COLLECTOR_REPO already exists"
else
    gh repo create "$COLLECTOR_REPO" --public --description "Offline-first PWA for Merremia invasive vine field data collection in Vanuatu" --clone=false
    print_ok "Created $COLLECTOR_REPO"
fi

# Step 3: Upload files
print_step "Step 3: Uploading files"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

upload_file() {
    local repo=$1 filepath=$2 local_file=$3 message=$4

    if [ ! -f "$local_file" ]; then
        print_warn "File not found: $local_file — skipping"
        return
    fi

    echo "  Uploading $filepath to $repo..."
    local content
    if [[ "$(uname)" == "Darwin" ]]; then
        content=$(base64 -i "$local_file")
    else
        content=$(base64 -w 0 "$local_file")
    fi

    local sha=""
    local existing=$(gh api "repos/$GITHUB_USER/$repo/contents/$filepath" 2>/dev/null || echo "")
    if echo "$existing" | grep -q '"sha"'; then
        sha=$(echo "$existing" | grep '"sha"' | head -1 | sed 's/.*"sha": *"//;s/".*//')
    fi

    local body
    if [ -n "$sha" ]; then
        body=$(jq -n --arg msg "$message" --arg content "$content" --arg sha "$sha" '{message:$msg,content:$content,sha:$sha}')
    else
        body=$(jq -n --arg msg "$message" --arg content "$content" '{message:$msg,content:$content}')
    fi

    if gh api --method PUT "repos/$GITHUB_USER/$repo/contents/$filepath" --input - <<< "$body" > /dev/null 2>&1; then
        print_ok "Uploaded $filepath"
    else
        print_err "Failed to upload $filepath"
    fi
}

# Upload field collector files
upload_file "$COLLECTOR_REPO" "index.html" "$SCRIPT_DIR/field-collector/index.html" "Add field collector app"
upload_file "$COLLECTOR_REPO" "sw.js" "$SCRIPT_DIR/field-collector/sw.js" "Add service worker"
upload_file "$COLLECTOR_REPO" "manifest.json" "$SCRIPT_DIR/field-collector/manifest.json" "Add PWA manifest"
upload_file "$COLLECTOR_REPO" "icons/icon-192.png" "$SCRIPT_DIR/field-collector/icons/icon-192.png" "Add 192px icon"
upload_file "$COLLECTOR_REPO" "icons/icon-512.png" "$SCRIPT_DIR/field-collector/icons/icon-512.png" "Add 512px icon"

# Upload connector and live dashboard to dashboard repo
upload_file "$DASHBOARD_REPO" "merremia-connector.js" "$SCRIPT_DIR/merremia-connector.js" "Add field data connector"
upload_file "$DASHBOARD_REPO" "dashboard-live.html" "$SCRIPT_DIR/dashboard-live.html" "Add live dashboard with field data integration"

# Step 4: Enable GitHub Pages
print_step "Step 4: Enabling GitHub Pages"

gh api --method POST "repos/$GITHUB_USER/$COLLECTOR_REPO/pages" \
    --input - << 'EOF' 2>/dev/null || print_warn "Pages may already be enabled on $COLLECTOR_REPO"
{"build_type":"legacy","source":{"branch":"main","path":"/"}}
EOF
print_ok "GitHub Pages configured on $COLLECTOR_REPO"

if ! gh api "repos/$GITHUB_USER/$DASHBOARD_REPO/pages" &> /dev/null; then
    gh api --method POST "repos/$GITHUB_USER/$DASHBOARD_REPO/pages" \
        --input - << 'EOF' 2>/dev/null || true
{"build_type":"legacy","source":{"branch":"main","path":"/"}}
EOF
fi
print_ok "GitHub Pages verified on $DASHBOARD_REPO"

# Step 5: Token instructions
print_step "Step 5: Create a GitHub Token"

echo ""
echo -e "${YELLOW}You need a Personal Access Token for the field app to sync data:${NC}"
echo ""
echo "  1. Go to: https://github.com/settings/tokens?type=beta"
echo "  2. Click 'Generate new token'"
echo "  3. Name:       merremia-field-sync"
echo "  4. Repo access: Only select repositories -> $DATA_REPO"
echo "  5. Permissions:  Contents -> Read and Write"
echo "  6. Generate and copy the token"
echo ""
echo "  Enter this token in the Field Collector app Settings tab."
echo ""

# Done
print_step "SETUP COMPLETE"

echo ""
echo -e "${GREEN}Your Merremia pipeline is ready:${NC}"
echo ""
echo "  Field Collector:  https://$GITHUB_USER.github.io/$COLLECTOR_REPO/"
echo "  Dashboard:        https://$GITHUB_USER.github.io/$DASHBOARD_REPO/"
echo "  Live Dashboard:   https://$GITHUB_USER.github.io/$DASHBOARD_REPO/dashboard-live.html"
echo "  Data Repo:        https://github.com/$GITHUB_USER/$DATA_REPO"
echo ""
echo -e "${YELLOW}Note: GitHub Pages can take 1-2 minutes to deploy.${NC}"
echo ""
echo "  Next steps:"
echo "  1. Create the GitHub token (see above)"
echo "  2. Open the Field Collector on your phone"
echo "  3. Go to Settings -> enter your GitHub config"
echo "  4. Start collecting data!"
echo ""
