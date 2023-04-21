copy _function\\x64\\Release\segmantation-typeA-v1.exe .
for %%i in (IN\*.*) do (
segmantation-typeA-v1.exe "%%i" out"%%i" src_param1.txt
)
pause

rem 3のモードは最高画質確認用
rem 本命は1,13のモードであり、最高画質は3モードである。