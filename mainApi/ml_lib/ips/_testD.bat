copy _function\\x64\\Release\segmantation-typeB-v2.exe .
for %%i in (IN\*.*) do (
segmantation-typeB-v2.exe "%%i" out"%%i" src_paramD.txt 50
)
pause

rem 3のモードは最高画質確認用
rem 本命は1,13のモードであり、最高画質は3モードである。