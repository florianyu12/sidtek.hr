@echo off
echo ========================================
echo   更新依赖并重新部署脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [1/6] 正在删除旧的依赖...
if exist "node_modules" (
    rmdir /s /q "node_modules"
    echo    已删除 node_modules
)

if exist "package-lock.json" (
    del "package-lock.json"
    echo    已删除 package-lock.json
)

echo.
echo [2/6] 正在安装最新依赖（包括安全补丁）...
call npm install
if errorlevel 1 (
    echo 错误: npm install 失败
    pause
    exit /b 1
)

echo.
echo [3/6] 正在验证 Next.js 配置...
if not exist "vercel.json" (
    echo    Vercel 配置文件不存在，正在创建...
)

if not exist ".gitignore" (
    echo    创建 .gitignore...
)

echo [4/6] 正在初始化 Git 仓库...
git init 2>nul
git add .
git commit -m "Update: Next.js 14.2.25 with security patches and Vercel config"

echo [5/6] 正在关联远程仓库...
git remote add origin https://github.com/florianyu12/sidtek.hr.git 2>nul
git branch -M main

echo [6/6] 正在推送代码到 GitHub...
git push -u origin main --force

echo.
echo ========================================
echo   完成！请前往 Vercel 重新部署
echo ========================================
echo.
echo 重要提示：
echo 1. 访问 https://vercel.com/deployments
echo 2. 选择之前部署失败的项目
echo 3. 点击右上角的 "Redeploy"
echo 4. 等待部署完成（1-2分钟）
echo.
pause
