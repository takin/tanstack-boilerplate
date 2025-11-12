#!/bin/bash

# System Monitoring Script untuk Load Testing
# Run this script in a separate terminal while running k6 tests
# Usage: ./monitor-system.sh [interval_seconds]

INTERVAL=${1:-5}  # Default: check every 5 seconds
LOG_FILE="system-monitor-$(date +%Y%m%d-%H%M%S).log"

echo "🔍 Starting System Monitor"
echo "📊 Interval: ${INTERVAL} seconds"
echo "📝 Log file: ${LOG_FILE}"
echo "Press Ctrl+C to stop"
echo ""

# Create log file with headers
echo "Timestamp,CPU%,Memory%,MemoryUsed,MemoryTotal,DiskUsed%,NetworkRx,NetworkTx" > "${LOG_FILE}"

# Color codes
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to get CPU usage
get_cpu() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        top -l 1 | grep "CPU usage" | awk '{print $3}' | sed 's/%//'
    else
        # Linux
        top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}'
    fi
}

# Function to get memory usage
get_memory() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        vm_stat | perl -ne '/page size of (\d+)/ and $size=$1; /Pages\s+([^:]+)[^\d]+(\d+)/ and printf("%-16s % 16.2f Mi\n", "$1:", $2 * $size / 1048576);' | grep -E "free|active|inactive|wired" | awk '{sum+=$2} END {print sum}'
    else
        # Linux
        free | grep Mem | awk '{print ($3/$2) * 100.0}'
    fi
}

# Function to get detailed memory info
get_memory_details() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        vm_stat | perl -ne '/page size of (\d+)/ and $size=$1; /Pages\s+([^:]+)[^\d]+(\d+)/ and printf("%s:%.2f\n", "$1", $2 * $size / 1048576);'
    else
        # Linux
        free -h | grep Mem
    fi
}

# Function to get disk usage
get_disk() {
    df -h / | tail -1 | awk '{print $5}' | sed 's/%//'
}

# Function to get network stats (simplified)
get_network() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS - simplified
        netstat -ibn | grep -e "en0" -e "en1" | head -1 | awk '{print "Rx:"$7" Tx:"$10}'
    else
        # Linux
        cat /proc/net/dev | grep eth0 | awk '{print "Rx:"$2" Tx:"$10}'
    fi
}

# Function to display colored bar
show_bar() {
    local value=$1
    local max=100
    local width=20
    local filled=$(echo "scale=0; $value * $width / $max" | bc)
    
    printf "["
    for ((i=0; i<width; i++)); do
        if [ $i -lt $filled ]; then
            if (( $(echo "$value >= 80" | bc -l) )); then
                printf "${RED}█${NC}"
            elif (( $(echo "$value >= 60" | bc -l) )); then
                printf "${YELLOW}█${NC}"
            else
                printf "${GREEN}█${NC}"
            fi
        else
            printf " "
        fi
    done
    printf "] %.1f%%\n" "$value"
}

# Function to check database connections (PostgreSQL)
check_db_connections() {
    # Requires psql and database credentials
    # Uncomment and configure if needed
    # psql -h localhost -U postgres -d your_db -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | tail -3 | head -1
    echo "N/A"
}

# Main monitoring loop
echo "┌────────────────────────────────────────────────────────────┐"
echo "│                   System Resource Monitor                  │"
echo "└────────────────────────────────────────────────────────────┘"

counter=0
while true; do
    timestamp=$(date "+%Y-%m-%d %H:%M:%S")
    
    # Get metrics
    cpu=$(get_cpu)
    memory=$(get_memory)
    disk=$(get_disk)
    network=$(get_network)
    
    # Display header every 10 iterations
    if [ $((counter % 10)) -eq 0 ]; then
        echo ""
        echo "──────────────────────────────────────────────────────────────"
        printf "%-20s | %-10s | %-10s | %-10s\n" "Time" "CPU" "Memory" "Disk"
        echo "──────────────────────────────────────────────────────────────"
    fi
    
    # Display current stats
    printf "%-20s | " "$timestamp"
    show_bar "$cpu"
    printf "%-20s | " ""
    show_bar "$memory"
    printf "%-20s | " ""
    show_bar "$disk"
    
    # Log to file (CSV format)
    echo "${timestamp},${cpu},${memory},0,0,${disk},${network}" >> "${LOG_FILE}"
    
    # Alert if high usage
    if (( $(echo "$cpu > 80" | bc -l) )); then
        echo "${RED}⚠️  WARNING: High CPU usage (${cpu}%)${NC}"
    fi
    
    if (( $(echo "$memory > 80" | bc -l) )); then
        echo "${RED}⚠️  WARNING: High Memory usage (${memory}%)${NC}"
    fi
    
    ((counter++))
    sleep $INTERVAL
done

