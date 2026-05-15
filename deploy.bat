@echo off
echo ========================================
echo   GitHub 推送脚本 - xitaikj-hr
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] 正在初始化 Git 仓库...
git init
if errorlevel 1 (
    echo 错误: Git 初始化失败，请确保已安装 Git
    pause
    exit /b 1
)

echo [2/4] 正在添加文件...
git add .
git commit -m "Initial commit: Xitai HR website"

echo [3/4] 正在关联远程仓库...
git remote add origin https://github.com/florianyu12/sidtek.hr.git

echo [4/4] 正在推送代码到 GitHub...
git branch -M main
git push -u origin main --force

echo.
echo ========================================
echo   推送完成！
echo ========================================
echo.
echo 下一步: 请访问 https://vercel.com
echo 然后使用 GitHub 登录并导入项目
echo.
pause
