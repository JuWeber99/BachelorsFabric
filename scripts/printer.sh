
function printYellowLine() {
  length=${#1}
  echo -e "\e[38;5;227m##############################################################\e[0m"
}

function printTask() {
  printYellowLine $1
  echo -e "\e[1;94m\t$1 \e[0m"
  printYellowLine
  echo
}

function printInfo() {
  echo -e "\e[1;38;5;105m$1 \e[0m"
  echo
}

function printError() {
  echo -e "\e[107;31m$1 \e[0m"
  echo
}
