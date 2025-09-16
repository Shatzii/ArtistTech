#!/bin/bash

# Artist Tech Recovery Script
# Handles database and file system restoration

set -e

# Configuration
BACKUP_ROOT="/backups"
RECOVERY_LOG="/var/log/artisttech/recovery.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" >> "$RECOVERY_LOG"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >> "$RECOVERY_LOG"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1" >> "$RECOVERY_LOG"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1" >> "$RECOVERY_LOG"
}

# Validate backup directory
validate_backup() {
    local backup_dir="$1"

    if [[ ! -d "$backup_dir" ]]; then
        error "Backup directory does not exist: $backup_dir"
        exit 1
    fi

    if [[ ! -r "$backup_dir" ]]; then
        error "Backup directory is not readable: $backup_dir"
        exit 1
    fi

    log "Backup directory validated: $backup_dir"
}

# Stop services before recovery
stop_services() {
    log "Stopping application services..."

    # Stop the main application
    if command -v pm2 &> /dev/null; then
        pm2 stop all 2>/dev/null || warn "PM2 stop failed"
        pm2 delete all 2>/dev/null || warn "PM2 delete failed"
    fi

    # Stop web server
    if command -v nginx &> /dev/null; then
        nginx -s stop 2>/dev/null || warn "Nginx stop failed"
    fi

    log "Services stopped"
}

# Start services after recovery
start_services() {
    log "Starting application services..."

    # Start web server
    if command -v nginx &> /dev/null; then
        nginx || error "Failed to start nginx"
        log "Nginx started"
    fi

    # Start the main application
    if command -v pm2 &> /dev/null && [[ -f "ecosystem.config.js" ]]; then
        pm2 start ecosystem.config.js || error "Failed to start application with PM2"
        log "Application started with PM2"
    fi

    log "Services started"
}

# Database recovery
recover_database() {
    local backup_dir="$1"
    local db_backup="$backup_dir/database_*.sql.gz"

    # Find the most recent database backup
    local latest_backup=$(ls -t $db_backup 2>/dev/null | head -1)

    if [[ -z "$latest_backup" ]]; then
        warn "No database backup found in $backup_dir"
        return
    fi

    log "Found database backup: $latest_backup"

    local db_host=${DB_HOST:-"localhost"}
    local db_port=${DB_PORT:-"5432"}
    local db_name=${DB_NAME:-"artisttech"}
    local db_user=${DB_USER:-"artisttech"}
    local db_password=${DB_PASSWORD}

    if [[ -z "$db_password" ]]; then
        error "Database password not provided"
        exit 1
    fi

    log "Starting database recovery..."

    # Export password for pg_restore
    export PGPASSWORD="$db_password"

    # Create a backup of current database (if it exists)
    local pre_recovery_backup="/tmp/pre_recovery_$(date +%s).sql"
    log "Creating pre-recovery backup..."

    if pg_dump \
        --host="$db_host" \
        --port="$db_port" \
        --username="$db_user" \
        --dbname="$db_name" \
        --no-password \
        --format=custom \
        --file="$pre_recovery_backup" 2>/dev/null; then

        log "Pre-recovery backup created: $pre_recovery_backup"
    else
        warn "Failed to create pre-recovery backup (database may not exist)"
    fi

    # Terminate active connections to the database
    log "Terminating active database connections..."
    psql \
        --host="$db_host" \
        --port="$db_port" \
        --username="$db_user" \
        --dbname="postgres" \
        --no-password \
        -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '$db_name';" \
        2>/dev/null || warn "Failed to terminate connections"

    # Drop and recreate database
    log "Recreating database..."
    psql \
        --host="$db_host" \
        --port="$db_port" \
        --username="$db_user" \
        --dbname="postgres" \
        --no-password \
        -c "DROP DATABASE IF EXISTS $db_name;" \
        2>/dev/null || warn "Failed to drop database"

    psql \
        --host="$db_host" \
        --port="$db_port" \
        --username="$db_user" \
        --dbname="postgres" \
        --no-password \
        -c "CREATE DATABASE $db_name;" \
        || error "Failed to create database"

    # Restore from backup
    log "Restoring database from backup..."
    if gunzip -c "$latest_backup" | pg_restore \
        --host="$db_host" \
        --port="$db_port" \
        --username="$db_user" \
        --dbname="$db_name" \
        --no-password \
        --verbose \
        --clean \
        --if-exists \
        --create; then

        log "Database recovery completed successfully"
    else
        error "Database recovery failed"

        # Attempt rollback
        if [[ -f "$pre_recovery_backup" ]]; then
            warn "Attempting to restore pre-recovery backup..."
            pg_restore \
                --host="$db_host" \
                --port="$db_port" \
                --username="$db_user" \
                --dbname="$db_name" \
                --no-password \
                "$pre_recovery_backup" \
                2>/dev/null || error "Rollback failed"
        fi

        exit 1
    fi

    # Clean up
    unset PGPASSWORD
    [[ -f "$pre_recovery_backup" ]] && rm -f "$pre_recovery_backup"
}

# File system recovery
recover_files() {
    local backup_dir="$1"
    local fs_backup="$backup_dir/filesystem_*.tar.gz"

    # Find the most recent file system backup
    local latest_backup=$(ls -t $fs_backup 2>/dev/null | head -1)

    if [[ -z "$latest_backup" ]]; then
        warn "No file system backup found in $backup_dir"
        return
    fi

    log "Found file system backup: $latest_backup"

    # Create recovery directory
    local recovery_temp="/tmp/artisttech_recovery_$(date +%s)"
    mkdir -p "$recovery_temp"

    log "Extracting file system backup to temporary location..."

    # Extract backup to temporary location
    if tar -xzf "$latest_backup" -C "$recovery_temp"; then
        log "File system backup extracted successfully"

        # Move files to their original locations
        local dirs=("uploads" "logs" "config")
        for dir in "${dirs[@]}"; do
            if [[ -d "$recovery_temp/$dir" ]]; then
                log "Restoring $dir directory..."

                # Create backup of current directory
                if [[ -d "$dir" ]]; then
                    mv "$dir" "${dir}.backup.$(date +%s)" 2>/dev/null || true
                fi

                # Restore from backup
                mv "$recovery_temp/$dir" "./$dir" || warn "Failed to restore $dir"
            fi
        done

        log "File system recovery completed"
    else
        error "File system extraction failed"
        exit 1
    fi

    # Clean up
    rm -rf "$recovery_temp"
}

# Configuration recovery
recover_config() {
    local backup_dir="$1"
    local config_backup="$backup_dir/config_*.tar.gz"

    # Find the most recent config backup
    local latest_backup=$(ls -t $config_backup 2>/dev/null | head -1)

    if [[ -z "$latest_backup" ]]; then
        warn "No configuration backup found in $backup_dir"
        return
    fi

    log "Found configuration backup: $latest_backup"

    # Extract configuration files
    if tar -xzf "$latest_backup"; then
        log "Configuration files restored successfully"
    else
        error "Configuration recovery failed"
        exit 1
    fi
}

# Redis recovery
recover_redis() {
    local backup_dir="$1"
    local redis_backup="$backup_dir/redis_*.rdb"

    # Find the most recent Redis backup
    local latest_backup=$(ls -t $redis_backup 2>/dev/null | head -1)

    if [[ -z "$latest_backup" ]]; then
        warn "No Redis backup found in $backup_dir"
        return
    fi

    log "Found Redis backup: $latest_backup"

    # Stop Redis service
    if command -v systemctl &> /dev/null; then
        systemctl stop redis 2>/dev/null || warn "Failed to stop Redis service"
    fi

    # Restore Redis dump
    if cp "$latest_backup" "/var/lib/redis/dump.rdb"; then
        log "Redis data restored"

        # Start Redis service
        if command -v systemctl &> /dev/null; then
            systemctl start redis 2>/dev/null || warn "Failed to start Redis service"
        fi

        log "Redis recovery completed"
    else
        error "Redis recovery failed"
        exit 1
    fi
}

# Verify recovery
verify_recovery() {
    log "Verifying recovery..."

    # Check database connectivity
    local db_host=${DB_HOST:-"localhost"}
    local db_port=${DB_PORT:-"5432"}
    local db_name=${DB_NAME:-"artisttech"}
    local db_user=${DB_USER:-"artisttech"}
    local db_password=${DB_PASSWORD}

    if [[ -n "$db_password" ]]; then
        export PGPASSWORD="$db_password"
        if psql \
            --host="$db_host" \
            --port="$db_port" \
            --username="$db_user" \
            --dbname="$db_name" \
            --no-password \
            -c "SELECT 1;" > /dev/null 2>&1; then

            log "Database connectivity verified"
        else
            warn "Database connectivity check failed"
        fi
        unset PGPASSWORD
    fi

    # Check application directories
    local dirs=("uploads" "logs" "config")
    for dir in "${dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            log "Directory $dir exists"
        else
            warn "Directory $dir missing"
        fi
    done

    # Check Redis connectivity
    if command -v redis-cli &> /dev/null && redis-cli ping > /dev/null 2>&1; then
        log "Redis connectivity verified"
    fi

    log "Recovery verification completed"
}

# Generate recovery report
generate_recovery_report() {
    local backup_dir="$1"
    local report_file="$backup_dir/recovery_report.txt"

    cat > "$report_file" << EOF
Artist Tech Recovery Report
===========================

Recovery Date: $(date)
Backup Used: $(basename "$backup_dir")
Recovery Status: SUCCESS

System Information:
- Hostname: $(hostname)
- OS: $(uname -s) $(uname -r)

Recovered Components:
- Database: PostgreSQL
- File System: uploads, logs, config
- Configuration: .env, config files
- Application State: Redis, PM2

Recovery Log: $RECOVERY_LOG
EOF

    log "Recovery report generated: $report_file"
}

# Main recovery function
main() {
    local backup_dir="$1"

    if [[ -z "$backup_dir" ]]; then
        error "Usage: $0 <backup_directory>"
        echo "Available backups:"
        ls -la "$BACKUP_ROOT" | grep "^d" | awk '{print $9}' | grep -v "^$"
        exit 1
    fi

    # Ensure absolute path
    if [[ "$backup_dir" != /* ]]; then
        backup_dir="$BACKUP_ROOT/$backup_dir"
    fi

    log "Starting Artist Tech recovery process..."
    log "Backup directory: $backup_dir"

    # Validate backup
    validate_backup "$backup_dir"

    # Stop services
    stop_services

    # Perform recovery
    recover_database "$backup_dir"
    recover_files "$backup_dir"
    recover_config "$backup_dir"
    recover_redis "$backup_dir"

    # Verify recovery
    verify_recovery

    # Generate report
    generate_recovery_report "$backup_dir"

    # Start services
    start_services

    log "Recovery completed successfully!"

    # Send notification
    if [[ -n "$NOTIFICATION_WEBHOOK" ]]; then
        curl -X POST "$NOTIFICATION_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"Artist Tech recovery completed successfully\"}" \
            2>/dev/null || true
    fi
}

# Error handling
trap 'error "Recovery process failed at line $LINENO"' ERR

# Initialize log directory
mkdir -p "$(dirname "$RECOVERY_LOG")"

# Run main function
main "$@"