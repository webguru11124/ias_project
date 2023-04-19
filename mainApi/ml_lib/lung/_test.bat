copy _function\\x64\\Release\grid_analize.exe .
for %%i in (IN\*.*) do (
grid_analize.exe "%%i" out"%%i" src_param.txt
)
pause

rem 3のモードは最高画質確認用
rem 本命は1,13のモードであり、最高画質は3モードである。