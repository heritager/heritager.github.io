# Heritager's Blog

个人博客，基于 Jekyll 构建，部署到 GitHub Pages。

线上地址：<https://heritager.github.io>

## 本地预览

先确保本机安装了 Ruby 和 Bundler。

```bash
bundle install
bundle exec jekyll serve
```

默认预览地址：<http://127.0.0.1:4000>

## 部署说明

仓库使用 GitHub Actions 构建并发布到 GitHub Pages。

如果当前环境没有 Ruby / Bundler，可以直接依赖线上 Actions 构建结果来验证站点是否可用。
