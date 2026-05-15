# 诊断和修复网站错误计划

## 问题描述
用户遇到错误：`Uncaught SyntaxError: Invalid regular expression: missing /`

## 问题分析

### 1. data.json 结构问题
- `company` 对象中存在重复字段：
  - `textAlign`, `textIndent`, `lineHeight`, `letterSpacing`, `fontSize`, `paragraphSpacing` 既作为顶层字段，又在 `descriptionFormat` 中重复定义
  - 这会导致数据不一致和潜在的正则表达式解析错误

### 2. 修复步骤

#### 步骤 1：修复 data.json 数据结构
- 移除 `company` 对象顶层的排版字段
- 只保留 `descriptionFormat` 对象中的排版设置

#### 步骤 2：清理 API route 代码
- 确保代码没有语法错误
- 验证所有正则表达式正确

#### 步骤 3：测试本地构建
- 运行 `npm run build` 确保构建成功
- 测试 API 请求

#### 步骤 4：推送修复到 GitHub
- 提交修复后的代码
- 验证 Netlify 部署成功

#### 步骤 5：验证网站功能
- 访问网站首页
- 测试管理后台保存功能

## 预期结果
- 消除正则表达式语法错误
- 修复 data.json 数据结构
- 恢复网站正常功能

## 注意事项
- 确保排版设置正确读取自 `descriptionFormat` 对象
- 验证所有 API 请求正常工作
