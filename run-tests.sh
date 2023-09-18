#!/bin/bash

if [ "${HEADED}" == "true" ]; then
  echo "Running tests in headed mode"
  export BROWSER_MODE='--headed'
else
  echo "Running tests in headless mode"
  export BROWSER_MODE='--headless'
fi

npm run wdio

filename="node_modules/wdio-html-nice-reporter/lib/makeReport.js"
line_number=41
replacement_text="\t\t\tshowInBrowser: false,"

awk -v line="${line_number}" -v replacement="${replacement_text}" 'NR==line {$0=replacement} {print}' "${filename}" > temp.js
mv temp.js "${filename}"

npm run report > /dev/null 2>&1

printf "Reports are saved: $(pwd)/reports/\n\n"
