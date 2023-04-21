copy _function\\x64\\Release\segmantation-typeB-v2.exe .
for %%i in (IN\*.*) do (
segmantation-typeB-v2.exe "%%i" out"%%i" src_paramA.txt 50
)
pause

