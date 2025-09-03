@rem prepare-release.cmd
@echo off

set branch=dev

if [%1]==[] goto :done
if [%2]==[] goto :done
if NOT [%3]==[] set branch=%3

git checkout %branch%
git pull
git checkout master
git pull
git merge --no-commit --no-ff %branch%
set merge_conflict=%ERRORLEVEL%
git merge --abort
if %merge_conflict% NEQ 0 (echo WARN Resolve merge conflict and try again & goto :eof)
git merge %branch%
call mvn versions:set -DnewVersion=%1
git add .
git commit -m "Prepare for release"
git push origin master
git checkout %branch%
git pull
git merge master
call mvn versions:set -DnewVersion=%2
git add .
git commit -m "Prepare for next iteration"
git push origin %branch%

:done
echo "Mandatory params to be provided: %1 - release version, %2 - next iteration version. Optional %3 - branch to be merged"
