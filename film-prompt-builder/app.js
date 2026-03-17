(function (global) {
  const STORAGE_KEY = "film-prompt-builder-form-v3";
  const LEGACY_STORAGE_KEYS = [
    "film-prompt-builder-form-v2",
    "film-prompt-builder-form",
  ];

  const PRESETS = [
    {
      id: "opening-video",
      label: "大会 / 峰会 / 发布会开场",
      videoType: "Opening Video",
      summary:
        "适合做开场气势、章节推进和品牌揭幕。关键不是堆视觉元素，而是让整条片子既有内容层推进，也有视觉层升级。",
      structureFocus:
        "长时长默认多段推进，至少 3 到 5 个内容层与视觉系统接力完成，不按 15 到 30 秒短开场逻辑处理。",
      contentFocus:
        "科技抽象层、业务/系统能力层、全球/行业信息层、章节口号推进层、品牌揭幕与收束层。",
      styleSummary:
        "大会开场气质、章节推进、情绪递进、品牌揭幕、节奏冲击、会议大屏高级表达。",
      avoidSummary:
        "最怕被写成粒子、标题、logo 循环播放的长版短片，或者只有视觉秀没有内容层。",
      execution: "hero still + selected direct-video + graphic-composite",
      platform: "会议大屏",
      durationSeconds: 120,
      targetAudience: "采购企业",
      coreGoal:
        "展示品牌的科技感、高端感、实力感与未来感，同时让观众形成对其技术体系、业务能力和行业地位的明确认知。",
      structureRequirement:
        "这是长时长大会开场片，按多段推进处理，至少设计 3 到 5 个不同内容层和视觉系统接力完成，不要按短开场或纯抽象品牌片处理。",
      contentLayers:
        "科技抽象开场层，业务/系统能力层，全球/行业信息层，章节口号推进层，品牌揭幕与正式收束层。",
      styleDirection:
        "大会开场气质，章节推进，情绪递进，品牌揭幕，节奏冲击，适合会议大屏的高级视觉表达。",
      referenceVisuals:
        "粒子，大字标题，数据流，材料微观，空间装置，品牌符号演化；这些元素仅作局部参考。",
      referenceContentWorld:
        "机房设备，人物操作，系统界面，全球图示，行业场景，品牌会场环境。",
      avoid:
        "不要整片反复粒子、标题、logo 同一套表达；不要做成内容空、只换标题词的长版短片；不要只做抽象视觉秀而缺少业务与系统层。",
      hardConstraints:
        "适配会议大屏；整体高级、克制、有品牌感；允许抽象视觉、人物、设备、场景、UI、图示混合出现，但必须统一在同一品牌调性中。",
      constraints: "",
      structureChipOptions: [
        "多段推进",
        "3到5个内容层",
        "多视觉系统接力",
        "章节式展开",
        "最后统一回收品牌揭幕",
      ],
      contentChipOptions: [
        "科技抽象层",
        "业务/系统能力层",
        "全球/行业信息层",
        "章节口号推进层",
        "品牌揭幕与收束层",
      ],
      styleChipOptions: [
        "大会开场气质",
        "章节推进",
        "情绪递进",
        "品牌揭幕",
        "节奏冲击",
        "高级视觉表达",
      ],
      visualChipOptions: [
        "粒子",
        "大字标题",
        "数据流",
        "材料微观",
        "空间装置",
        "品牌符号演化",
      ],
      worldChipOptions: [
        "机房设备",
        "人物操作",
        "系统界面",
        "全球图示",
        "行业场景",
      ],
      avoidChipOptions: [
        "不要单一母题撑满全片",
        "不要粒子+标题+logo循环",
        "不要内容空转",
        "不要只有抽象视觉秀",
      ],
      hardConstraintChipOptions: [
        "适配会议大屏",
        "整体高级克制",
        "有品牌感",
        "允许内容层与视觉层混合",
      ],
    },
    {
      id: "enterprise-promo",
      label: "企业宣传 / 解决方案片",
      videoType: "Enterprise Promo",
      summary:
        "适合建立可信度、能力感和规模感，强调企业定位、能力证明和行业场景。",
      structureFocus: "企业问题或背景 -> 能力或方案 -> 结果与信任收束。",
      contentFocus: "行业背景、企业能力、解决方案模块、客户价值、结果证明。",
      styleSummary: "企业科技感、可信度、专业表达、行业场景、稳重质感。",
      avoidSummary: "最怕广告腔太重、空口号太多，最后看不出真实能力。",
      execution: "still-to-video + hybrid-reference",
      platform: "官网 / 宣讲 / B端沟通",
      durationSeconds: 60,
      targetAudience: "客户 / 合作方 / 管理层",
      coreGoal: "建立企业专业可信的品牌印象，并让观众明确其能力与方案价值。",
      structureRequirement:
        "按问题、能力、方案、结果的逻辑推进，信息层级清晰，避免散乱堆砌场景。",
      contentLayers: "行业背景层，能力展示层，方案层，结果与信任层。",
      styleDirection: "专业、可信、科技、稳重、克制，兼顾行业气质与品牌质感。",
      referenceVisuals: "数据面板，流程模块，空间镜面，几何结构，光线系统。",
      referenceContentWorld: "行业场景，团队协作，设备系统，城市工业环境，客户业务场景。",
      avoid: "不要广告腔过重；不要空口号；不要节奏过碎；不要把企业片写成开场片。",
      hardConstraints: "适合 B 端沟通；整体可信专业；不过度娱乐化。",
      constraints: "",
      structureChipOptions: ["问题到方案", "能力分层展示", "结果收束", "逻辑清晰"],
      contentChipOptions: ["行业背景层", "能力展示层", "方案层", "结果与信任层"],
      styleChipOptions: ["专业可信", "企业科技感", "稳重质感", "行业视角"],
      visualChipOptions: ["数据面板", "流程模块", "空间镜面", "几何结构"],
      worldChipOptions: ["行业场景", "团队协作", "设备系统", "城市工业环境"],
      avoidChipOptions: ["不要广告腔过重", "不要空口号", "不要节奏过碎"],
      hardConstraintChipOptions: ["适合B端沟通", "整体可信专业", "不过度娱乐化"],
    },
    {
      id: "brand-image-film",
      label: "品牌形象片",
      videoType: "Brand Image Film",
      summary:
        "适合塑造品牌气质、记忆点和审美母题，重点在品牌感受而不是信息讲解。",
      structureFocus: "气质建立 -> 品牌母题深化 -> 记忆点与收束。",
      contentFocus: "品牌气质层、记忆点层、品牌价值层、收束层。",
      styleSummary: "高级感、情绪推进、品牌记忆点、质感和节奏控制。",
      avoidSummary: "最怕一边想做品牌感，一边又塞太多说明信息。",
      execution: "still-to-video with hero-frame control",
      platform: "品牌发布 / 官网首页 / 传播窗口",
      durationSeconds: 60,
      targetAudience: "客户 / 行业受众 / 大众传播",
      coreGoal: "让观众先记住品牌感受和品牌气质，再接受品牌表达。",
      structureRequirement: "优先做品牌气质和记忆点推进，不要写成企业资料介绍片。",
      contentLayers: "品牌气质层，记忆点层，品牌价值层，收束层。",
      styleDirection: "品牌质感、情绪递进、视觉母题、记忆点控制、高级克制。",
      referenceVisuals: "流光，玻璃质感，金属边框，中央主视觉，空间光面。",
      referenceContentWorld: "品牌空间，产品世界，生活方式场景，象征性环境。",
      avoid: "不要堆说明信息；不要汇报片语气；不要为炫技牺牲统一气质。",
      hardConstraints: "整体高级；视觉统一；节奏可慢但不能散。",
      constraints: "",
      structureChipOptions: ["气质建立", "母题深化", "记忆点收束"],
      contentChipOptions: ["品牌气质层", "记忆点层", "品牌价值层", "收束层"],
      styleChipOptions: ["品牌质感", "情绪递进", "高级克制", "视觉母题"],
      visualChipOptions: ["流光", "玻璃质感", "金属边框", "中央主视觉"],
      worldChipOptions: ["品牌空间", "产品世界", "生活方式场景", "象征性环境"],
      avoidChipOptions: ["不要堆说明信息", "不要汇报片语气", "不要炫技失控"],
      hardConstraintChipOptions: ["整体高级", "视觉统一", "节奏稳定"],
    },
    {
      id: "process-explainer",
      label: "流程说明 / MG讲解",
      videoType: "Training / Process Explainer Short",
      summary:
        "适合低歧义、步骤清晰的说明型内容，优先使用模块、卡片、图标和流程可视化。",
      structureFocus: "问题或背景 -> 步骤展开 -> 结果与使用收益。",
      contentFocus: "问题背景层、步骤层、结果层、行动层。",
      styleSummary: "信息清晰、模块化、低歧义、易读、强结构。",
      avoidSummary: "最怕为了炫技牺牲可读性，或者把说明片写成情绪片。",
      execution: "graphic-composite first, UI demo friendly",
      platform: "Internal comms / 培训 / 医学说明",
      durationSeconds: 20,
      targetAudience: "内部团队 / 受训对象 / 项目参与方",
      coreGoal: "让观众快速看懂步骤、关系和结果。",
      structureRequirement: "按步骤或模块展开，每一步都要易读、易执行、易交付。",
      contentLayers: "问题背景层，步骤层，结果层，行动层。",
      styleDirection: "信息清晰、模块化、低歧义、流程可视化、纯 MG 友好。",
      referenceVisuals: "卡片，图标，流程箭头，数据面板，时间轴，分屏布局。",
      referenceContentWorld: "系统界面，表单流程，业务节点，结果反馈，操作场景。",
      avoid: "不要真人演绎；不要过多情绪化包装；不要为了酷炫牺牲可读性。",
      hardConstraints: "优先纯 MG；步骤清晰；读图效率高。",
      constraints: "不要真人，不要实拍，不要复杂 3D 长镜头。",
      structureChipOptions: ["步骤展开", "模块分层", "结果收束", "信息优先"],
      contentChipOptions: ["问题背景层", "步骤层", "结果层", "行动层"],
      styleChipOptions: ["信息清晰", "模块化", "低歧义", "流程可视化"],
      visualChipOptions: ["卡片", "图标", "流程箭头", "数据面板", "时间轴"],
      worldChipOptions: ["系统界面", "表单流程", "业务节点", "结果反馈"],
      avoidChipOptions: ["不要真人演绎", "不要可读性差", "不要过度情绪化包装"],
      hardConstraintChipOptions: ["优先纯MG", "步骤清晰", "读图效率高"],
    },
    {
      id: "guest-intro",
      label: "嘉宾 / 环节引入",
      videoType: "MC / Guest Intro Video",
      summary:
        "适合短时高势能地引出嘉宾或环节，重点是身份、资历、舞台仪式感和出现时刻。",
      structureFocus: "身份钩子 -> 亮点聚焦 -> 舞台揭幕。",
      contentFocus: "身份信息层、亮点层、出场层。",
      styleSummary: "舞台包装、仪式感、荣耀感、短促有力。",
      avoidSummary: "最怕身份信息不清楚，或者开场还没立住就已经结束。",
      execution: "hero still + graphic-composite",
      platform: "会议大屏 / 节目串场",
      durationSeconds: 20,
      targetAudience: "现场观众",
      coreGoal: "用最短时间把嘉宾或环节有气势地引出来。",
      structureRequirement: "不要讲完整故事，重点做身份、亮点和出场节奏。",
      contentLayers: "身份信息层，亮点层，出场层。",
      styleDirection: "舞台感、仪式感、荣耀感、短平快、强揭幕。",
      referenceVisuals: "姓名牌，职位牌，舞台空间，扫光，金属边框，中央主视觉。",
      referenceContentWorld: "嘉宾身份，资历亮点，舞台环境，节目环节。",
      avoid: "不要背景交代过长；不要解释型叙述；不要拖慢节奏。",
      hardConstraints: "适配大屏；身份信息清楚；开场要干净有力。",
      constraints: "",
      structureChipOptions: ["身份钩子", "亮点聚焦", "舞台揭幕"],
      contentChipOptions: ["身份信息层", "亮点层", "出场层"],
      styleChipOptions: ["舞台感", "仪式感", "荣耀感", "短平快"],
      visualChipOptions: ["姓名牌", "职位牌", "扫光", "中央主视觉"],
      worldChipOptions: ["嘉宾身份", "资历亮点", "舞台环境", "节目环节"],
      avoidChipOptions: ["不要背景过长", "不要解释型叙述", "不要拖慢节奏"],
      hardConstraintChipOptions: ["适配大屏", "身份信息清楚", "开场有力"],
    },
    {
      id: "concept-narrative",
      label: "科技概念 / 数智概念片",
      videoType: "Concept Narrative Short",
      summary:
        "适合讲概念、转化和未来感，用一条清晰的视觉隐喻或系统化视觉表达去串联主题。",
      structureFocus: "概念引出 -> 转化展开 -> 未来或价值收束。",
      contentFocus: "概念层、转化层、价值层、收束层。",
      styleSummary: "科技感、未来感、概念转化、视觉隐喻、抽象但可读。",
      avoidSummary: "最怕概念主线发散，最后只剩酷炫镜头没有论点。",
      execution: "still-to-video, motif and transformation first",
      platform: "品牌活动 / 数智主题传播",
      durationSeconds: 30,
      targetAudience: "客户 / 合作方 / 内部团队",
      coreGoal: "把抽象技术概念讲成立，而且让视觉有记忆点。",
      structureRequirement: "保持一条清晰主线，用概念递进而不是堆砌太多业务点。",
      contentLayers: "概念层，转化层，价值层，收束层。",
      styleDirection: "科技感、未来感、概念演绎、视觉隐喻、抽象转化。",
      referenceVisuals: "光线，网格，粒子，数据空间，几何图形，系统演化。",
      referenceContentWorld: "系统模型，概念关系，未来场景，技术逻辑。",
      avoid: "不要同时做概念片和解释片；不要为了酷炫丢失主线。",
      hardConstraints: "主线清晰；视觉抽象但可读；不做廉价科幻。",
      constraints: "",
      structureChipOptions: ["概念引出", "转化展开", "价值收束"],
      contentChipOptions: ["概念层", "转化层", "价值层", "收束层"],
      styleChipOptions: ["科技感", "未来感", "概念演绎", "视觉隐喻"],
      visualChipOptions: ["光线", "网格", "粒子", "数据空间", "几何图形"],
      worldChipOptions: ["系统模型", "概念关系", "未来场景", "技术逻辑"],
      avoidChipOptions: ["不要主线混乱", "不要过度炫技", "不要概念解释混杂"],
      hardConstraintChipOptions: ["主线清晰", "抽象但可读", "不廉价科幻"],
    },
  ];

  const DEFAULT_EXTRA_NOTE =
    "请按完整 film-pipeline 执行，生成 00 summary 和 Step 1 到 Step 5 全部标准文件。";

  function findPresetByVideoType(videoType) {
    return PRESETS.find((preset) => preset.videoType === videoType) || PRESETS[0];
  }

  function compact(value) {
    return String(value || "").trim();
  }

  function splitLegacyStyleKeywords(rawValue) {
    const value = compact(rawValue);
    if (!value) {
      return { styleDirection: "", referenceVisuals: "" };
    }

    const referenceIndicators = [
      "粒子",
      "标题",
      "大字",
      "logo",
      "LOGO",
      "数据流",
      "材料",
      "空间",
      "装置",
      "符号",
      "光束",
      "流光",
      "卡片",
      "图标",
      "面板",
      "网格",
      "边框",
      "舞台",
      "姓名牌",
      "职位牌",
      "时间轴",
      "箭头",
      "几何",
      "镜面",
    ];

    const parts = value
      .split(/[，,、/\n]+/)
      .map((part) => compact(part))
      .filter(Boolean);

    const style = [];
    const reference = [];

    parts.forEach((part) => {
      const target = referenceIndicators.some((indicator) => part.includes(indicator))
        ? reference
        : style;
      target.push(part);
    });

    return {
      styleDirection: style.join("，"),
      referenceVisuals: reference.join("，"),
    };
  }

  function appendFieldValue(field, value) {
    const current = compact(field.value);
    field.value = current ? `${current}，${value}` : value;
    field.dispatchEvent(new Event("input"));
  }

  function combineReferenceKeywords(referenceVisuals, referenceContentWorld) {
    const visuals = compact(referenceVisuals);
    const worlds = compact(referenceContentWorld);
    if (visuals && worlds) {
      return `${visuals}；内容世界可参考：${worlds}`;
    }
    return visuals || worlds;
  }

  function generateFilmPrompt(data) {
    const legacySplit = splitLegacyStyleKeywords(data.styleKeywords);

    const theme = compact(data.theme);
    const videoType = compact(data.videoType);
    const platform = compact(data.platform);
    const durationSeconds = compact(data.durationSeconds);
    const targetAudience = compact(data.targetAudience);
    const coreGoal = compact(data.coreGoal);
    const structureRequirement = compact(data.structureRequirement);
    const contentLayers = compact(data.contentLayers);
    const styleDirection = compact(data.styleDirection) || legacySplit.styleDirection;
    const referenceVisuals =
      compact(data.referenceVisuals) || legacySplit.referenceVisuals;
    const referenceContentWorld = compact(data.referenceContentWorld);
    const referenceKeywords = combineReferenceKeywords(
      referenceVisuals,
      referenceContentWorld,
    );
    const avoid = compact(data.avoid);
    const hardConstraints = compact(data.hardConstraints);
    const constraints = compact(data.constraints);
    const extraNote = compact(data.extraNote);

    const lines = ["/film"];

    if (theme) lines.push(`主题: ${theme}`);
    if (videoType) lines.push(`video_type: ${videoType}`);
    if (platform) lines.push(`平台: ${platform}`);
    if (durationSeconds) lines.push(`duration_seconds: ${durationSeconds}`);
    if (targetAudience) lines.push(`target_audience: ${targetAudience}`);

    const bodyLines = [];
    if (coreGoal) bodyLines.push(`core_goal: ${coreGoal}`);
    if (structureRequirement) {
      bodyLines.push(`structure_requirement: ${structureRequirement}`);
    }
    if (contentLayers) bodyLines.push(`content_layers: ${contentLayers}`);
    if (styleDirection) bodyLines.push(`style_direction: ${styleDirection}`);
    if (referenceVisuals) {
      bodyLines.push(`reference_visuals: ${referenceVisuals}`);
    }
    if (referenceContentWorld) {
      bodyLines.push(`reference_content_world: ${referenceContentWorld}`);
    }
    if (referenceKeywords) bodyLines.push(`reference_keywords: ${referenceKeywords}`);
    if (avoid) bodyLines.push(`avoid: ${avoid}`);
    if (hardConstraints) bodyLines.push(`hard_constraints: ${hardConstraints}`);
    if (constraints) bodyLines.push(`constraints: ${constraints}`);

    if (bodyLines.length > 0) {
      lines.push("");
      lines.push(...bodyLines);
    }

    if (extraNote) {
      lines.push("");
      lines.push(extraNote);
    }

    return lines.join("\n");
  }

  function downloadText(filename, content) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      toast.hidden = true;
    }, 1800);
  }

  function loadSavedData() {
    const raw =
      localStorage.getItem(STORAGE_KEY) ||
      LEGACY_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find(Boolean);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch (_error) {
      return null;
    }
  }

  function bootstrap() {
    const themeInput = document.getElementById("theme");
    const videoTypeSelect = document.getElementById("video-type");
    const platformInput = document.getElementById("platform");
    const durationInput = document.getElementById("duration-seconds");
    const audienceInput = document.getElementById("target-audience");
    const coreGoalInput = document.getElementById("core-goal");
    const structureRequirementInput = document.getElementById(
      "structure-requirement",
    );
    const contentLayersInput = document.getElementById("content-layers");
    const styleDirectionInput = document.getElementById("style-direction");
    const referenceVisualsInput = document.getElementById("reference-visuals");
    const referenceContentWorldInput = document.getElementById(
      "reference-content-world",
    );
    const avoidInput = document.getElementById("avoid");
    const hardConstraintsInput = document.getElementById("hard-constraints");
    const constraintsInput = document.getElementById("constraints");
    const extraNoteInput = document.getElementById("extra-note");
    const resultBox = document.getElementById("result");
    const presetList = document.getElementById("preset-list");
    const structureChipRow = document.getElementById("structure-chip-row");
    const contentChipRow = document.getElementById("content-chip-row");
    const styleChipRow = document.getElementById("style-chip-row");
    const visualChipRow = document.getElementById("visual-chip-row");
    const worldChipRow = document.getElementById("world-chip-row");
    const avoidChipRow = document.getElementById("avoid-chip-row");
    const hardChipRow = document.getElementById("hard-chip-row");
    const presetTitle = document.getElementById("preset-title");
    const presetDesc = document.getElementById("preset-desc");
    const presetStructure = document.getElementById("preset-structure");
    const presetContent = document.getElementById("preset-content");
    const presetStyle = document.getElementById("preset-style");
    const presetAvoid = document.getElementById("preset-avoid");
    const presetExecution = document.getElementById("preset-execution");

    let activePreset = PRESETS[0];

    PRESETS.forEach((preset) => {
      const option = document.createElement("option");
      option.value = preset.videoType;
      option.textContent = `${preset.label} | ${preset.videoType}`;
      videoTypeSelect.appendChild(option);
    });

    function renderPresetCards() {
      presetList.innerHTML = "";
      PRESETS.forEach((preset) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = `preset-card${preset.id === activePreset.id ? " active" : ""}`;
        card.innerHTML = `
          <div class="preset-name">${preset.label}</div>
          <div class="preset-type">${preset.videoType}</div>
          <div class="preset-summary">${preset.summary}</div>
        `;
        card.addEventListener("click", () => {
          activePreset = preset;
          videoTypeSelect.value = preset.videoType;
          renderPresetCards();
          renderPresetMeta();
          generateAndRender();
        });
        presetList.appendChild(card);
      });
    }

    function renderChipSet(container, values, targetField, messagePrefix, className) {
      container.innerHTML = "";
      (values || []).forEach((value) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `chip-btn ${className}`.trim();
        button.textContent = value;
        button.addEventListener("click", () => {
          appendFieldValue(targetField, value);
          showToast(`${messagePrefix}${value}`);
        });
        container.appendChild(button);
      });
    }

    function renderPresetMeta() {
      presetTitle.textContent = activePreset.label;
      presetDesc.textContent = activePreset.summary;
      presetStructure.textContent = activePreset.structureFocus;
      presetContent.textContent = activePreset.contentFocus;
      presetStyle.textContent = activePreset.styleSummary;
      presetAvoid.textContent = activePreset.avoidSummary;
      presetExecution.textContent = activePreset.execution;

      renderChipSet(
        structureChipRow,
        activePreset.structureChipOptions,
        structureRequirementInput,
        "已加入结构要求：",
        "structure-chip",
      );
      renderChipSet(
        contentChipRow,
        activePreset.contentChipOptions,
        contentLayersInput,
        "已加入内容层：",
        "content-chip",
      );
      renderChipSet(
        styleChipRow,
        activePreset.styleChipOptions,
        styleDirectionInput,
        "已加入风格方向：",
        "style-chip",
      );
      renderChipSet(
        visualChipRow,
        activePreset.visualChipOptions,
        referenceVisualsInput,
        "已加入视觉参考：",
        "reference-chip",
      );
      renderChipSet(
        worldChipRow,
        activePreset.worldChipOptions,
        referenceContentWorldInput,
        "已加入内容世界：",
        "world-chip",
      );
      renderChipSet(
        avoidChipRow,
        activePreset.avoidChipOptions,
        avoidInput,
        "已加入避免事项：",
        "risk-chip",
      );
      renderChipSet(
        hardChipRow,
        activePreset.hardConstraintChipOptions,
        hardConstraintsInput,
        "已加入硬约束：",
        "constraint-chip",
      );
    }

    function applyPresetToForm(forceOverwrite) {
      themeInput.placeholder = `例如：${activePreset.label}`;
      videoTypeSelect.value = activePreset.videoType;

      if (forceOverwrite || !compact(platformInput.value)) {
        platformInput.value = activePreset.platform;
      }
      if (forceOverwrite || !compact(durationInput.value)) {
        durationInput.value = activePreset.durationSeconds;
      }
      if (forceOverwrite || !compact(audienceInput.value)) {
        audienceInput.value = activePreset.targetAudience;
      }
      if (forceOverwrite || !compact(coreGoalInput.value)) {
        coreGoalInput.value = activePreset.coreGoal;
      }
      if (forceOverwrite || !compact(structureRequirementInput.value)) {
        structureRequirementInput.value = activePreset.structureRequirement;
      }
      if (forceOverwrite || !compact(contentLayersInput.value)) {
        contentLayersInput.value = activePreset.contentLayers;
      }
      if (forceOverwrite || !compact(styleDirectionInput.value)) {
        styleDirectionInput.value = activePreset.styleDirection;
      }
      if (forceOverwrite || !compact(referenceVisualsInput.value)) {
        referenceVisualsInput.value = activePreset.referenceVisuals;
      }
      if (forceOverwrite || !compact(referenceContentWorldInput.value)) {
        referenceContentWorldInput.value = activePreset.referenceContentWorld;
      }
      if (forceOverwrite || !compact(avoidInput.value)) {
        avoidInput.value = activePreset.avoid;
      }
      if (forceOverwrite || !compact(hardConstraintsInput.value)) {
        hardConstraintsInput.value = activePreset.hardConstraints;
      }
      if (forceOverwrite || !compact(constraintsInput.value)) {
        constraintsInput.value = activePreset.constraints;
      }
      if (forceOverwrite || !compact(extraNoteInput.value)) {
        extraNoteInput.value = DEFAULT_EXTRA_NOTE;
      }

      generateAndRender();
    }

    function collectFormData() {
      return {
        theme: themeInput.value,
        videoType: videoTypeSelect.value,
        platform: platformInput.value,
        durationSeconds: durationInput.value,
        targetAudience: audienceInput.value,
        coreGoal: coreGoalInput.value,
        structureRequirement: structureRequirementInput.value,
        contentLayers: contentLayersInput.value,
        styleDirection: styleDirectionInput.value,
        referenceVisuals: referenceVisualsInput.value,
        referenceContentWorld: referenceContentWorldInput.value,
        avoid: avoidInput.value,
        hardConstraints: hardConstraintsInput.value,
        constraints: constraintsInput.value,
        extraNote: extraNoteInput.value,
      };
    }

    function generateAndRender() {
      const data = collectFormData();
      resultBox.value = generateFilmPrompt(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function restoreSavedForm() {
      const saved = loadSavedData();
      if (!saved) {
        videoTypeSelect.value = activePreset.videoType;
        durationInput.value = activePreset.durationSeconds;
        extraNoteInput.value = DEFAULT_EXTRA_NOTE;
        renderPresetMeta();
        generateAndRender();
        return;
      }

      const legacySplit = splitLegacyStyleKeywords(saved.styleKeywords);

      themeInput.value = saved.theme || "";
      videoTypeSelect.value = saved.videoType || activePreset.videoType;
      platformInput.value = saved.platform || "";
      durationInput.value = saved.durationSeconds || activePreset.durationSeconds;
      audienceInput.value = saved.targetAudience || "";
      coreGoalInput.value = saved.coreGoal || "";
      structureRequirementInput.value = saved.structureRequirement || "";
      contentLayersInput.value = saved.contentLayers || "";
      styleDirectionInput.value = saved.styleDirection || legacySplit.styleDirection || "";
      referenceVisualsInput.value =
        saved.referenceVisuals ||
        saved.referenceKeywords ||
        legacySplit.referenceVisuals ||
        "";
      referenceContentWorldInput.value = saved.referenceContentWorld || "";
      avoidInput.value = saved.avoid || "";
      hardConstraintsInput.value = saved.hardConstraints || "";
      constraintsInput.value = saved.constraints || "";
      extraNoteInput.value = saved.extraNote || DEFAULT_EXTRA_NOTE;
      activePreset = findPresetByVideoType(videoTypeSelect.value);

      renderPresetCards();
      renderPresetMeta();
      generateAndRender();
    }

    videoTypeSelect.addEventListener("change", () => {
      activePreset = findPresetByVideoType(videoTypeSelect.value);
      renderPresetCards();
      renderPresetMeta();
      generateAndRender();
    });

    document.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("input", generateAndRender);
    });

    document.getElementById("apply-preset-btn").addEventListener("click", () => {
      applyPresetToForm(true);
      showToast("已写入当前预设");
    });

    document.getElementById("generate-btn").addEventListener("click", () => {
      generateAndRender();
      showToast("已生成提示词");
    });

    document.getElementById("copy-btn").addEventListener("click", async () => {
      generateAndRender();
      await navigator.clipboard.writeText(resultBox.value);
      showToast("已复制到剪贴板");
    });

    document.getElementById("download-btn").addEventListener("click", () => {
      generateAndRender();
      const filename = `${compact(themeInput.value) || "film_prompt"}.txt`;
      downloadText(filename, resultBox.value);
      showToast("已导出 TXT");
    });

    document.getElementById("clear-btn").addEventListener("click", () => {
      themeInput.value = "";
      platformInput.value = "";
      durationInput.value = activePreset.durationSeconds;
      audienceInput.value = "";
      coreGoalInput.value = "";
      structureRequirementInput.value = "";
      contentLayersInput.value = "";
      styleDirectionInput.value = "";
      referenceVisualsInput.value = "";
      referenceContentWorldInput.value = "";
      avoidInput.value = "";
      hardConstraintsInput.value = "";
      constraintsInput.value = "";
      extraNoteInput.value = DEFAULT_EXTRA_NOTE;
      generateAndRender();
      showToast("已清空表单");
    });

    document.getElementById("load-example-btn").addEventListener("click", () => {
      activePreset = findPresetByVideoType("Opening Video");
      renderPresetCards();
      renderPresetMeta();

      themeInput.value = "希捷开场视频";
      videoTypeSelect.value = "Opening Video";
      platformInput.value = "会议大屏";
      durationInput.value = "120";
      audienceInput.value = "采购企业";
      coreGoalInput.value =
        "不仅展示希捷企业的科技感、高端感、品牌实力与未来感，还要让观众感受到其技术体系、业务能力、行业覆盖与品牌地位。";
      structureRequirementInput.value =
        "这是120秒大会开场正片，不要按短开场或纯抽象品牌片处理。结构上应至少包含3到5个不同内容层，并由不同视觉系统承载。";
      contentLayersInput.value =
        "科技抽象开场层，业务/系统能力层，全球/行业信息层，章节口号推进层，品牌揭幕与正式收束层。";
      styleDirectionInput.value =
        "大会开场气质，章节推进，情绪递进，节奏冲击，品牌揭幕，适合会议大屏的高级视觉表达；既要有科技审美，也要有真实业务重量。";
      referenceVisualsInput.value =
        "粒子，大字标题，数据流，材料微观，空间装置，品牌符号演化；这些元素仅作局部参考。";
      referenceContentWorldInput.value =
        "机房设备，人物操作，系统界面，全球图示，行业场景。";
      avoidInput.value =
        "不要整片反复使用粒子、标题、logo同一套表达；不要做成内容空、只换标题词的长版短片；不要只做抽象视觉秀而缺少业务与系统层。";
      hardConstraintsInput.value =
        "适配会议大屏；整体高级、克制、有品牌感；允许抽象视觉、人物、设备、场景、UI、图示混合出现，但必须统一在同一品牌调性中；未经用户提供，不要擅自创造 slogan、品牌口号或大会主题文案。";
      constraintsInput.value = "";
      extraNoteInput.value = DEFAULT_EXTRA_NOTE;
      generateAndRender();
      showToast("已加载新版示例");
    });

    renderPresetCards();
    renderPresetMeta();
    restoreSavedForm();
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  }

  global.generateFilmPrompt = generateFilmPrompt;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { PRESETS, generateFilmPrompt, DEFAULT_EXTRA_NOTE };
  }
})(typeof window !== "undefined" ? window : globalThis);
