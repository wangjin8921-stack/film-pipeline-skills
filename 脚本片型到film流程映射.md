# 脚本片型到 `/film` 流程映射

这份说明基于 NAS 里的 OpenClaw 当前生效版本整理，目标是把你已有的“脚本片型参考库”直接对接到 `/film` 的 `step-1` 到 `step-5`。

适用的 NAS skill 路径：

- `/home/node/.openclaw/workspace/skills/film-pipeline`
- `/home/node/.openclaw/workspace/skills/step-1-film-director`
- `/home/node/.openclaw/workspace/skills/step-2-film-scriptboard`
- `/home/node/.openclaw/workspace/skills/step-3-prompt-director`
- `/home/node/.openclaw/workspace/skills/step-4-shot-executor`
- `/home/node/.openclaw/workspace/skills/step-5-director-prompts`

## 先记住这条总逻辑

`/film` 不是一步出片，而是这条链：

1. `step-1` 定片型、定导演思路、定边界
2. `step-2` 展开成分镜和镜头清单
3. `step-3` 把镜头变成提示词策略包
4. `step-4` 变成可执行的生产计划
5. `step-5` 输出真正可复制的生成 prompts

所以你以后先选片型，再喂给 `/film`，效率会最高。

## 片型 1：大会 / 峰会 / 发布会 / 年会 / 医学论坛开场

推荐 `video_type`：

- `Opening Video`

这类片子的主打法：

- 核心任务是起势、造氛围、做舞台 handoff
- 不是讲流程，不是讲功能
- 重点是主题揭幕、章节词、品牌亮相、情绪抬升

在 `/film` 里会这样走：

- `step-1`：重点锁“开场片”边界，避免跑成企业介绍或说明片
- `step-2`：分镜会偏少而重，强调 build -> reveal -> peak -> handoff
- `step-3`：提示词会更短、更有冲击力，强调 hero frame、reveal、title beats
- `step-4`：执行上优先出 `hero_reveals`、`title_system`、`impact_motion`
- `step-5`：最终 prompt 要短、猛、明确，避免解释性太强

执行偏向：

- 偏 `hero still + selected direct-video + graphic-composite`
- 标题、口号、揭幕动作很重要

适合的 `/film` 起手写法：

```text
video_type: Opening Video
style_keywords: 大会开场, 大字字幕, 章节词, 情绪推进, 光线粒子, 品牌揭幕
core_goal: 快速建立气氛并把现场带入主会主题
```

## 片型 2：企业宣传片 / 行业解决方案片 / 企业简介

推荐 `video_type`：

- `Enterprise Promo`

这类片子的主打法：

- 核心任务是建立信任感、能力感、规模感
- 常见结构是行业背景 -> 企业能力 -> 解决方案 -> 信任收束
- 不能剪得太 hype，也不能写成纯产品广告

在 `/film` 里会这样走：

- `step-1`：重点锁企业可信度、品牌调性、叙事主轴
- `step-2`：分镜会偏环境、团队、工厂、流程、成果证明
- `step-3`：提示词更重环境一致性和“人在工作中”的可信画面
- `step-4`：执行上会先锁 `brand_environments` 和 `team_selects`
- `step-5`：prompt 要稳，不要堆“震撼、史诗、未来感”这种空词

执行偏向：

- 偏 `still-to-video + hybrid-reference`
- 优先做环境连续性和团队可信度

适合的 `/film` 起手写法：

```text
video_type: Enterprise Promo
style_keywords: 企业科技感, 行业解决方案, 能力展示, 城市/工业场景, 可信度, 方案叙事
core_goal: 建立企业专业可信的品牌印象
```

## 片型 3：品牌形象片 / 品牌里程碑片 / 文旅宣传片

推荐 `video_type`：

- `Brand Image Film`

这类片子的主打法：

- 核心任务是建立品牌气质，不是密集解释
- 更重情绪、质感、品牌世界观、记忆点
- 节奏通常比企业宣传片更克制、更高级

在 `/film` 里会这样走：

- `step-1`：重点锁品牌命题、视觉母题、气质边界
- `step-2`：分镜更偏 hero shots、motif shots、情绪递进
- `step-3`：提示词会更强调 motif continuity 和 hero-frame control
- `step-4`：执行上先锁 `hero_frames`、`motif_variants`
- `step-5`：prompt 更重画面气质和统一母题，不重说明性

执行偏向：

- 偏 `still-to-video`
- 先定 signature hero frame，再做动画微动

适合的 `/film` 起手写法：

```text
video_type: Brand Image Film
style_keywords: 品牌质感, 情绪推进, 里程碑, 文化气质, 生活方式, 记忆点
core_goal: 让观众先记住品牌感受，再接受品牌表达
```

## 片型 4：医疗患教 / 流程讲解 / 项目说明

推荐 `video_type`：

- `Training / Process Explainer Short`

可选补充：

- 如果更偏制度、政策、规范传达，可改为 `Policy / Compliance Communication`
- 如果更偏纯信息图表达，也可考虑 `MG Explainer / Information Short`

这类片子的主打法：

- 核心任务是讲清楚，不是讲浪漫
- 必须低歧义、步骤清楚、层级清楚
- 适合流程图、卡片、模块、界面、图标系统

在 `/film` 里会这样走：

- `step-1`：重点锁信息结构和观众理解路径
- `step-2`：分镜会明显按 setup -> steps -> result 走
- `step-3`：提示词会偏 process state、labels、UI blocks、graphic logic
- `step-4`：执行上先出 `step_templates`、`screen_states`、`guided_outputs`
- `step-5`：prompt 会更像“清晰的图形说明语句”，而不是电影镜头语句

执行偏向：

- 明显偏 `graphic-composite`
- UI demo 和卡片化模块优先于真人表演

适合的 `/film` 起手写法：

```text
video_type: Training / Process Explainer Short
style_keywords: 信息清晰, 模块化, 流程说明, 低歧义, MG信息表达
core_goal: 让观众快速看懂流程、步骤和结果
```

## 片型 5：颁奖 / 串场 / 嘉宾引入 / 舞台功能片

推荐 `video_type`：

- `MC / Guest Intro Video`

可选补充：

- 如果只是段落切换和节目包装，可改为 `Program Interstitial / Segment Bumper`

这类片子的主打法：

- 核心任务是把人或环节“引出来”
- 片长通常更短，功能性更强
- 不需要讲完整人生或完整品牌故事

在 `/film` 里会这样走：

- `step-1`：重点锁“身份 -> 资历/钩子 -> 出场”
- `step-2`：分镜偏少，强调 name card、title、prestige cue、impact reveal
- `step-3`：提示词会更紧凑，主打身份感和舞台仪式感
- `step-4`：执行上先做 `guest_hero`、`name_cards`、`intro_reveals`
- `step-5`：prompt 要干净直接，方便快速出一套可用 intro 版式

执行偏向：

- 偏 `hero still + graphic-composite`
- 同一套名字/职位/舞台包装系统很关键

适合的 `/film` 起手写法：

```text
video_type: MC / Guest Intro Video
style_keywords: 舞台包装, 荣誉感, reveal, 嘉宾引入, 节目节点
core_goal: 用最短时间把嘉宾或环节有气势地引出来
```

## 片型 6：AI / 数智 / 科技概念片

推荐 `video_type`：

- `Concept Narrative Short`

可选补充：

- 如果本质是信息讲解，不要硬做概念片，改成 `MG Explainer / Information Short`

这类片子的主打法：

- 核心任务是把一个概念讲得有画面、有母题、有变化
- 更适合“隐喻 + 转化 + 未来感”路线
- 不能一边做概念片，一边硬塞太多业务点

在 `/film` 里会这样走：

- `step-1`：重点锁中心隐喻、转化机制、主题主线
- `step-2`：分镜会偏 setup -> escalation -> transformation -> payoff
- `step-3`：提示词重点是 motif、transformation、symbolic anchor
- `step-4`：执行上先锁 `motif_anchor`、`transformation_steps`、`hero_payoffs`
- `step-5`：prompt 会更强调“画面怎么变”，而不是“信息怎么列”

执行偏向：

- 偏 `still-to-video`
- 先定关键母题画面，再做连续变化

适合的 `/film` 起手写法：

```text
video_type: Concept Narrative Short
style_keywords: AIGC-first, 数字人, 科技概念, 未来感, 抽象转化, 视觉隐喻
core_goal: 用一条清晰的视觉隐喻把技术概念讲成立
```

## 片型 7：团队片 / 宣言片 / 内部激励片

推荐 `video_type`：

- `Internal Promo / Internal Adoption Short`

可选补充：

- 如果更偏招人和雇主形象，可改为 `Recruitment Promo`
- 如果更偏领导讲话包装，可改为 `Leadership Message Film`

这类片子的主打法：

- 核心任务是内部动员、共识建立、团队士气
- 比企业宣传更近人，更强调“我们为什么一起干”
- 既不能太空，也不能太硬

在 `/film` 里会这样走：

- `step-1`：重点锁内部目标、真实场景、团队情绪
- `step-2`：分镜偏日常工作场景、团队协作、明确收益
- `step-3`：提示词会更重办公室环境、熟悉任务、低术语表达
- `step-4`：执行上先锁 `workflow_anchor`、`ui_states` 或 `team_anchor`
- `step-5`：prompt 应该直给、好懂、有人味，不要写成空喊口号

执行偏向：

- 偏 `still-to-video + UI/composite support`
- 如果有人物和团队，就把环境与人物连续性锁好

适合的 `/film` 起手写法：

```text
video_type: Internal Promo / Internal Adoption Short
style_keywords: 团队士气, 宣言感, 战役感, 内部激励, 集结, 荣誉感
core_goal: 让内部团队迅速进入同一个目标和情绪状态
```

## 快速选型规则

如果你以后懒得细想，可以先按这个逻辑选：

- 活动开场、论坛、峰会、发布会：`Opening Video`
- 企业能力、行业方案、工厂、平台：`Enterprise Promo`
- 品牌情绪、品牌故事、里程碑：`Brand Image Film`
- 医疗说明、流程、患教、项目介绍：`Training / Process Explainer Short`
- 颁奖、嘉宾、主持人、节目串场：`MC / Guest Intro Video`
- AI 概念、未来感、数字人、抽象科技表达：`Concept Narrative Short`
- 团队士气、内部动员、内部宣导：`Internal Promo / Internal Adoption Short`

## 哪些类型最该偏 `graphic-composite`

下面这些，进入 `/film` 后就应该主动往图形系统、卡片系统、界面系统上靠：

- `Training / Process Explainer Short`
- `Policy / Compliance Communication`
- `MG Explainer / Information Short`
- `Data Visualization Film`
- `UI Demo / Screenflow Video`
- `Program Interstitial / Segment Bumper`

这些类型如果硬写成“电影镜头语言”，通常会跑偏。

## 哪些类型在 Step 5 要写得更短更猛

下面这些，Step 5 的 prompt 适合更短、更冲、更强调节奏和揭幕：

- `Opening Video`
- `Warm-Up / Hype Video`
- `MC / Guest Intro Video`
- `Flash / Quick-Cut Montage`
- `Trailer / Teaser Style Short`

相反，下面这些要写得更稳、更清楚：

- `Enterprise Promo`
- `Training / Process Explainer Short`
- `Internal Promo / Internal Adoption Short`
- `Interview Film`
- `Leadership Message Film`

## 最后一个实用建议

你后面真正用 `/film` 时，最值钱的不是“重新从零描述项目”，而是先做这三件事：

1. 先定 `video_type`
2. 再给 5 到 8 个 `style_keywords`
3. 再写一句最核心的 `core_goal`

只要这三件事定准了，`step-1` 到 `step-5` 基本都会顺很多。
