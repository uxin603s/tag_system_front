PATH=/sbin:/usr/sbin:/bin:/usr/bin:/usr/local/sbin:/usr/local/bin; export PATH
cmd="java -jar ${HOME}/yuicompressor-2.4.8.jar ";
result=""

result="`${cmd} tagSystem.js`${result}"

for js in `find ./components -name '*.js' -type f`; do
    result="${result}`${cmd} ${js}`"
done
for js in `find ./factories -name '*.js' -type f`; do
    result="${result}`${cmd} ${js}`"
done
echo ${result} > tagSystem.min.js