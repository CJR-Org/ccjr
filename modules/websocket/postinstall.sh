rm -rf wsServer
git clone https://github.com/Theldus/wsServer
cd wsServer
make
rm -rf example
rm -rf tests
rm -rf extra
rm -rf doc
rm -rf README.md
rm -rf CMakeLists.txt
rm -rf .gitignore
rm -rf .clang-format
rm -rf .travis.yml
rm -rf Makefile
cd ..
