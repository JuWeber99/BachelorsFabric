
function printYellowLine() {
  echo -e "\e[38;5;227m##############################################################\e[0m"
}

function printTask() {
  printYellowLine
  echo -e "\e[1;94m\t$1 \e[0m"
  printYellowLine
  echo
}


function printSubtask() {
  echo -e "\e[1;4;94m\t$1 \e[0m"
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
