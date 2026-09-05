# 陈怀桂的个人主页

[访问主页](https://incecheng.github.io/) · [在线简历](https://incecheng.github.io/cv/)

面向 Agent / AI 应用后端方向的个人作品集，包含个人介绍、问迹项目、高校系统集成案例、获奖图册和简历 PDF。使用 Jekyll 3.10，部署在 GitHub Pages；无需 Node.js 构建，也没有外部字体或前端运行依赖。

## 更新内容

| 内容 | 文件 |
| --- | --- |
| 个人资料、联系信息、教育与工作经历 | `_data/profile.yml` |
| 首页时间线与首屏结构 | `index.html` |
| 首页项目摘要 | `_data/projects.yml` |
| 获奖信息与语言资质 | `_data/awards.yml` |
| 获奖照片与证书预览图 | `assets/awards/` |
| 在线简历证书叠放交互 | `_includes/resume-award-stack.html` |
| 竞赛证书原始 PDF | `files/awards/` |
| 项目详情 | `_case_studies/wenji.md`、`_case_studies/library.md` |
| 简历下载 | `files/resume.pdf` |
| 导航 | `_data/navigation.yml` |
| 页面外观 | `assets/css/portfolio.css` |

个人资料与项目描述以本人确认的信息为准。案例中的数字按任务规模、管理范围和测试覆盖分别描述；流程图用于说明技术职责。

获奖图册保留照片与证书的完整比例，以纸张边缘阴影展示，使用 WebP 缩略图并延迟加载。首页点击打开大图；在线简历右侧点击叠放证书可逐张轮换，“放大查看”打开共用预览，原图与证书 PDF 独立保留。入场、悬停与预览动效遵循系统的“减少动态效果”设置。新增奖项时更新 `_data/awards.yml`，首页与在线简历会同步；已有简历 PDF 仅在明确需要时替换。英语四级目前使用文字展示。

## 本地预览

使用 Ruby 3.3 或 3.4 和 Bundler。Apple Silicon Mac 已通过 Homebrew 安装 Ruby 时，可先执行：

```sh
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
```

在项目目录运行：

```sh
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve --host 127.0.0.1
```

然后访问 <http://127.0.0.1:4000>。只生成静态文件：

```sh
bundle exec jekyll build
```

产物在 `_site/`。旧主题、示例内容和内部设计文档通过 `_config.yml` 排除，不会生成公开页面。旧的 About、Portfolio、Skills 和 Resume 地址保留跳转。

## 发布

仓库 Pages 配置为从 `master` 分支根目录构建，推送后由 GitHub Pages 自动发布。可以在仓库 Actions 查看构建与部署结果。

发布前检查首页、两篇案例、在线简历、奖项大图与原始文件链接，并检查 320px 手机布局、桌面布局和深浅色外观。证书预览支持左右方向键切换、Esc 关闭和关闭后的焦点返回。

- [GitHub Pages 官方发布说明](https://docs.github.com/zh/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Pages 支持的依赖版本](https://pages.github.com/versions/)

## 来源与许可

本仓库最初基于 [Academic Pages](https://github.com/academicpages/academicpages.github.io) 创建，保留原有 `LICENSE`。当前作品集使用独立布局、样式与内容数据。
