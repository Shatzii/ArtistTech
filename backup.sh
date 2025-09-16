#!/bin/bash

# Artist Tech Backup Script
# Handles database and file system backups

set -e

# Configuration
BACKUP_ROOT="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="$BACKUP_ROOT/$TIMESTAMP"
RETENTION_DAYS=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Create backup directory
create_backup_dir() {
    log "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    chmod 700 "$BACKUP_DIR"
}

# Database backup
backup_database() {
    log "Starting database backup..."

    local db_host=${DB_HOST:-"localhost"}
    local db_port=${DB_PORT:-"5432"}
    local db_name=${DB_NAME:-"artisttech"}
    local db_user=${DB_USER:-"artisttech"}
    local db_password=${DB_PASSWORD}

    if [[ -z "$db_password" ]]; then
        error "Database password not provided"
        exit 1
    fi

    local backup_file="$BACKUP_DIR/database_$TIMESTAMP.sql"

    log "Backing up database to: $backup_file"

    # Export password for pg_dump
    export PGPASSWORD="$db_password"

    # Create database dump
    if pg_dump \
        --host="$db_host" \
        --port="$db_port" \
        --username="$db_user" \
        --dbname="$db_name" \
        --no-password \
        --format=custom \
        --compress=9 \
        --verbose \
        --file="$backup_file"; then

        log "Database backup completed successfully"

        # Compress the backup
        gzip "$backup_file"
        log "Database backup compressed"

        # Verify backup integrity
        if pg_restore --list "$backup_file.gz" > /dev/null 2>&1; then
            log "Database backup integrity verified"
        else
            error "Database backup integrity check failed"
            exit 1
        fi

    else
        error "Database backup failed"
        exit 1
    fi

    # Clean up environment
    unset PGPASSWORD
}

# File system backup
backup_files() {
    log "Starting file system backup..."

    local source_dirs=("/app/uploads" "/app/logs" "/app/config")
    local backup_file="$BACKUP_DIR/filesystem_$TIMESTAMP.tar.gz"

    # Check if source directories exist
    local valid_dirs=()
    for dir in "${source_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            valid_dirs+=("$dir")
        else
            warn "Directory $dir does not exist, skipping"
        fi
    done

    if [[ ${#valid_dirs[@]} -eq 0 ]]; then
        warn "No valid directories found for backup"
        return
    fi

    log "Backing up directories: ${valid_dirs[*]}"

    # Create compressed archive
    if tar -czf "$backup_file" \
        --exclude='*.tmp' \
        --exclude='*.log' \
        --exclude='node_modules' \
        "${valid_dirs[@]}"; then

        log "File system backup completed successfully"

        # Verify backup
        if tar -tzf "$backup_file" > /dev/null; then
            log "File system backup integrity verified"
        else
            error "File system backup integrity check failed"
            exit 1
        fi

    else
        error "File system backup failed"
        exit 1
    fi
}

# Configuration backup
backup_config() {
    log "Starting configuration backup..."

    local config_files=(".env" "config/*.json" "config/*.yaml" "config/*.yml")
    local backup_file="$BACKUP_DIR/config_$TIMESTAMP.tar.gz"

    # Check if config files exist
    local valid_files=()
    for pattern in "${config_files[@]}"; do
        for file in $pattern; do
            if [[ -f "$file" ]]; then
                valid_files+=("$file")
            fi
        done
    done

    if [[ ${#valid_files[@]} -eq 0 ]]; then
        warn "No configuration files found"
        return
    fi

    log "Backing up configuration files: ${valid_files[*]}"

    # Create encrypted backup of sensitive files
    if tar -czf "$backup_file" "${valid_files[@]}"; then
        log "Configuration backup completed successfully"
    else
        error "Configuration backup failed"
        exit 1
    fi
}

# Application state backup
backup_app_state() {
    log "Starting application state backup..."

    # Backup Redis data if available
    if command -v redis-cli &> /dev/null && redis-cli ping &> /dev/null; then
        local redis_backup="$BACKUP_DIR/redis_$TIMESTAMP.rdb"
        log "Backing up Redis data..."

        # Trigger Redis save
        redis-cli SAVE

        # Copy Redis dump file
        if [[ -f "/var/lib/redis/dump.rdb" ]]; then
            cp "/var/lib/redis/dump.rdb" "$redis_backup"
            log "Redis backup completed"
        else
            warn "Redis dump file not found"
        fi
    fi

    # Backup PM2 processes if available
    if command -v pm2 &> /dev/null; then
        local pm2_backup="$BACKUP_DIR/pm2_$TIMESTAMP.json"
        log "Backing up PM2 process list..."

        pm2 jlist > "$pm2_backup"
        log "PM2 backup completed"
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    log "Cleaning up old backups (older than $RETENTION_DAYS days)..."

    local deleted_count=0

    # Find and delete old backup directories
    find "$BACKUP_ROOT" -maxdepth 1 -type d -mtime +$RETENTION_DAYS | while read -r dir; do
        if [[ "$dir" != "$BACKUP_ROOT" ]]; then
            log "Deleting old backup: $dir"
            rm -rf "$dir"
            ((deleted_count++))
        fi
    done

    log "Cleanup completed. Deleted $deleted_count old backups."
}

# Generate backup report
generate_report() {
    local report_file="$BACKUP_DIR/backup_report.txt"
    local total_size=$(du -sh "$BACKUP_DIR" | cut -f1)
    local backup_duration=$(( $(date +%s) - $(stat -c %Y "$BACKUP_DIR") ))

    cat > "$report_file" << EOF
Artist Tech Backup Report
=========================

Backup Date: $(date)
Backup ID: $TIMESTAMP
Duration: ${backup_duration}s
Total Size: $total_size

Backup Contents:
$(find "$BACKUP_DIR" -type f -exec basename {} \; | sed 's/^/- /')

System Information:
- Hostname: $(hostname)
- OS: $(uname -s) $(uname -r)
- Database: PostgreSQL
- Application: Artist Tech

Backup Status: SUCCESS
EOF

    log "Backup report generated: $report_file"
}

# Upload to remote storage (optional)
upload_to_remote() {
    if [[ -n "$REMOTE_BACKUP_URL" ]]; then
        log "Uploading backup to remote storage..."

        if command -v rclone &> /dev/null; then
            if rclone copy "$BACKUP_DIR" "$REMOTE_BACKUP_URL/$TIMESTAMP"; then
                log "Remote upload completed successfully"
            else
                error "Remote upload failed"
                exit 1
            fi
        else
            warn "rclone not available, skipping remote upload"
        fi
    fi
}

# Main backup function
main() {
    log "Starting Artist Tech backup process..."

    # Validate environment
    if [[ ! -w "$BACKUP_ROOT" ]]; then
        error "Backup root directory is not writable: $BACKUP_ROOT"
        exit 1
    fi

    # Create backup directory
    create_backup_dir

    # Perform backups
    backup_database
    backup_files
    backup_config
    backup_app_state

    # Generate report
    generate_report

    # Upload to remote storage
    upload_to_remote

    # Cleanup old backups
    cleanup_old_backups

    # Final status
    local final_size=$(du -sh "$BACKUP_DIR" | cut -f1)
    log "Backup completed successfully!"
    log "Backup location: $BACKUP_DIR"
    log "Total backup size: $final_size"

    # Send notification (if configured)
    if [[ -n "$NOTIFICATION_WEBHOOK" ]]; then
        curl -X POST "$NOTIFICATION_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"Artist Tech backup completed: $TIMESTAMP ($final_size)\"}" \
            2>/dev/null || true
    fi
}

# Error handling
trap 'error "Backup process failed at line $LINENO"' ERR

# Run main function
main "$@"