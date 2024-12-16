#!/bin/bash
# wait-for-it.sh

host=$1
shift
until nc -z -v -w30 $host 3306; do
  echo "Aguardando MySQL iniciar..."
  sleep 1
done
echo "MySQL pronto para conexões!"
exec "$@"
