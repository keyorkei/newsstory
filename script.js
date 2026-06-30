document.addEventListener("DOMContentLoaded", () => {
  setupReveal();
  setupProgress();
  setupToc();
  setupLightbox();
  setupBackTop();
  setupCharts();
});

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  items.forEach((item) => observer.observe(item));
}

function setupProgress() {
  const bar = document.querySelector(".progress-bar");
  const update = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = height > 0 ? (scrollTop / height) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function setupToc() {
  const links = Array.from(document.querySelectorAll(".toc-link"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  const update = () => {
    const checkpoint = window.scrollY + 140;
    let active = sections[0];

    sections.forEach((section) => {
      if (section.offsetTop <= checkpoint) active = section;
    });

    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${active.id}`);
    });
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupLightbox() {
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = lightbox.querySelector("img");
  const lightboxText = lightbox.querySelector("p");
  const closeButton = lightbox.querySelector(".lightbox-close");

  const close = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    lightboxImg.alt = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll("img.zoomable").forEach((img) => {
    img.addEventListener("click", () => {
      const caption = img.closest("figure")?.querySelector("figcaption")?.innerText || img.alt;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxText.textContent = caption;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  closeButton.addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) close();
  });
}

function setupBackTop() {
  const button = document.querySelector(".back-top");
  const update = () => {
    button.classList.toggle("show", window.scrollY > 520);
  };

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function setupCharts() {
  if (!window.echarts) {
    document.body.classList.add("charts-missing");
    return;
  }

  const charts = [];
  const blue = "#2563EB";
  const blueDeep = "#1E40AF";
  const sky = "#38BDF8";
  const orange = "#F97316";
  const amber = "#F59E0B";
  const teal = "#14B8A6";
  const rose = "#E11D48";
  const slate = "#334155";
  const muted = "#64748B";
  const gridLine = "#E5E7EB";

  const makeGradient = (top, bottom) =>
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: top },
      { offset: 1, color: bottom },
    ]);

  const baseText = {
    color: slate,
    fontFamily: "Noto Sans SC, Source Han Sans SC, Microsoft YaHei, sans-serif",
  };

  const init = (id, option) => {
    const element = document.getElementById(id);
    if (!element) return null;
    try {
      const chart = echarts.init(element, null, { renderer: "canvas" });
      chart.setOption(option);
      charts.push(chart);
      return chart;
    } catch (error) {
      console.error(`Chart init failed: ${id}`, error);
      document.body.classList.add("charts-missing");
      return null;
    }
  };

  init("chart-users", {
    color: [blue, orange],
    title: {
      text: "中国泛二次元用户规模持续扩容",
      subtext: "单位：亿人；增长率为同比",
      left: 8,
      top: 4,
      textStyle: { ...baseText, fontSize: 18, fontWeight: 800 },
      subtextStyle: { ...baseText, color: muted, fontSize: 12 },
    },
    tooltip: { trigger: "axis" },
    legend: { bottom: 0, textStyle: baseText },
    grid: { left: 48, right: 54, top: 86, bottom: 64 },
    xAxis: {
      type: "category",
      data: ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025E", "2026E", "2027E", "2028E", "2029E"],
      axisLabel: { color: muted, interval: 0, rotate: 28 },
      axisLine: { lineStyle: { color: gridLine } },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: "value",
        name: "用户规模（亿人）",
        min: 0,
        max: 6,
        axisLabel: { color: muted },
        nameTextStyle: { color: muted },
        splitLine: { lineStyle: { color: gridLine } },
      },
      {
        type: "value",
        name: "同比增长率",
        axisLabel: { color: muted, formatter: "{value}%" },
        nameTextStyle: { color: muted },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: "中国泛二次元用户规模",
        type: "bar",
        data: [2.12, 2.52, 3.54, 4.55, 4.6, 4.86, 4.9, 5.03, 5.26, 5.49, 5.57, 5.67, 5.7],
        barWidth: "48%",
        itemStyle: { borderRadius: [6, 6, 0, 0], color: makeGradient("#60A5FA", blue) },
        label: { show: true, position: "top", color: slate, fontSize: 11 },
      },
      {
        name: "同比增长率",
        type: "line",
        yAxisIndex: 1,
        data: [null, 18.87, 40.48, 28.53, 1.1, 5.65, 0.82, 2.65, 4.57, 4.37, 1.46, 1.8, 0.53],
        smooth: true,
        symbolSize: 7,
        lineStyle: { width: 3 },
      },
    ],
  });

  init("chart-market", {
    color: [blue],
    title: {
      text: "泛二次元及周边市场走向八千亿级",
      subtext: "单位：亿元",
      left: 8,
      top: 4,
      textStyle: { ...baseText, fontSize: 18, fontWeight: 800 },
      subtextStyle: { ...baseText, color: muted, fontSize: 12 },
    },
    tooltip: { trigger: "axis", valueFormatter: (value) => `${value} 亿元` },
    grid: { left: 58, right: 20, top: 84, bottom: 52 },
    xAxis: {
      type: "category",
      data: ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025E", "2026E", "2027E", "2028E", "2029E"],
      axisLabel: { color: muted, interval: 0, rotate: 28 },
      axisLine: { lineStyle: { color: gridLine } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      name: "市场规模（亿元）",
      axisLabel: { color: muted },
      nameTextStyle: { color: muted },
      splitLine: { lineStyle: { color: gridLine } },
    },
    series: [
      {
        name: "中国泛二次元及周边市场规模",
        type: "bar",
        data: [2212, 2568, 2983, 3523, 4267, 4510, 5013, 5977, 6521, 6921, 7287, 7735, 8344],
        barWidth: "52%",
        itemStyle: { borderRadius: [6, 6, 0, 0], color: makeGradient("#93C5FD", blue) },
        label: { show: true, position: "top", color: slate, fontSize: 11 },
      },
    ],
  });

  init("chart-industry", {
    title: {
      text: "吃喝场景占据联名案例主场",
      left: "center",
      top: 4,
      textStyle: { ...baseText, fontSize: 18, fontWeight: 800 },
    },
    tooltip: { trigger: "item", formatter: "{b}<br/>{d}%" },
    legend: { bottom: 0, textStyle: baseText },
    color: [blue, sky, orange, amber, "#94A3B8"],
    series: [
      {
        name: "行业分布",
        type: "pie",
        radius: ["44%", "68%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: "#ffffff", borderWidth: 4 },
        label: {
          formatter: "{b}\n{d}%",
          color: slate,
          fontSize: 13,
          lineHeight: 20,
        },
        data: [
          { value: 33.3, name: "茶饮" },
          { value: 25, name: "咖啡" },
          { value: 25, name: "快餐/餐饮" },
          { value: 8.3, name: "零售" },
          { value: 8.3, name: "潮玩零售" },
        ],
      },
    ],
  });

  const heatRows = ["必胜客×原神", "喜茶×光与夜之恋", "名创优品×Chiikawa", "古茗×恋与深空", "瑞幸×黑神话", "泡泡玛特×哪吒2", "古茗×星穹铁道"];
  const heatCols = ["排队", "售罄", "黄牛/二手溢价", "App/小程序崩溃", "官方回应/道歉"];
  const heatValues = [
    [1, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1],
    [1, 1, 0, 1, 1],
  ];
  init("chart-heatmap", {
    title: {
      text: "爆款联名常伴随供应链压力",
      left: 8,
      top: 4,
      textStyle: { ...baseText, fontSize: 18, fontWeight: 800 },
    },
    tooltip: {
      position: "top",
      formatter: (params) => {
        const [x, y, value] = params.value;
        return `${heatRows[y]}<br>${heatCols[x]}：${value ? "出现" : "未见明显表现"}`;
      },
    },
    grid: { left: 132, right: 16, top: 74, bottom: 94 },
    xAxis: {
      type: "category",
      data: heatCols,
      axisLabel: { color: slate, interval: 0, rotate: 32 },
      axisLine: { lineStyle: { color: gridLine } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "category",
      data: heatRows,
      inverse: true,
      axisLabel: { color: slate },
      axisLine: { lineStyle: { color: gridLine } },
      axisTick: { show: false },
    },
    visualMap: {
      min: 0,
      max: 1,
      show: false,
      inRange: { color: ["#F8FAFC", blueDeep] },
    },
    series: [
      {
        name: "爆款特征",
        type: "heatmap",
        data: heatValues.flatMap((row, y) => row.map((value, x) => [x, y, value])),
        label: {
          show: true,
          formatter: (params) => (params.value[2] ? "✓" : ""),
          color: "#ffffff",
          fontSize: 20,
          fontWeight: 800,
        },
        itemStyle: {
          borderColor: "#ffffff",
          borderWidth: 3,
          borderRadius: 5,
        },
        emphasis: {
          itemStyle: { shadowBlur: 8, shadowColor: "rgba(37, 99, 235, 0.24)" },
        },
      },
    ],
  });

  init("chart-official-price", {
    color: [sky, teal],
    title: {
      text: "官方售价：联名版抬升客单价",
      left: 8,
      top: 4,
      textStyle: { ...baseText, fontSize: 16, fontWeight: 800 },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (value) => `${value} 元`,
    },
    legend: { bottom: 0, textStyle: baseText },
    grid: { left: 54, right: 14, top: 72, bottom: 58 },
    xAxis: {
      type: "category",
      data: ["一加 Ace6T", "水月雨 PILL"],
      axisLabel: { color: slate },
      axisLine: { lineStyle: { color: gridLine } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      name: "元",
      axisLabel: { color: muted },
      nameTextStyle: { color: muted },
      splitLine: { lineStyle: { color: gridLine } },
    },
    series: [
      {
        name: "普通版",
        type: "bar",
        data: [3199, 199],
        barMaxWidth: 34,
        itemStyle: { borderRadius: [6, 6, 0, 0], color: makeGradient("#93C5FD", sky) },
        label: { show: true, position: "top", color: slate },
      },
      {
        name: "联名版",
        type: "bar",
        data: [3699, 239],
        barMaxWidth: 34,
        itemStyle: { borderRadius: [6, 6, 0, 0], color: makeGradient("#86EFAC", teal) },
        label: { show: true, position: "top", color: slate },
      },
    ],
  });

  init("chart-resale-price", {
    color: [sky, amber],
    title: {
      text: "二级市场：稀缺性继续推高价格",
      left: 8,
      top: 4,
      textStyle: { ...baseText, fontSize: 16, fontWeight: 800 },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (value) => `${value} 元`,
    },
    legend: { bottom: 0, textStyle: baseText },
    grid: { left: 54, right: 14, top: 72, bottom: 58 },
    xAxis: {
      type: "category",
      data: ["一加 Ace6T", "水月雨 PILL"],
      axisLabel: { color: slate },
      axisLine: { lineStyle: { color: gridLine } },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value",
      name: "元",
      axisLabel: { color: muted },
      nameTextStyle: { color: muted },
      splitLine: { lineStyle: { color: gridLine } },
    },
    series: [
      {
        name: "官方售价",
        type: "bar",
        data: [3699, 239],
        barMaxWidth: 34,
        itemStyle: { borderRadius: [6, 6, 0, 0], color: makeGradient("#93C5FD", sky) },
        label: { show: true, position: "top", color: slate },
      },
      {
        name: "二级市场售价",
        type: "bar",
        data: [4399, 700],
        barMaxWidth: 34,
        itemStyle: { borderRadius: [6, 6, 0, 0], color: makeGradient("#FDE68A", amber) },
        label: {
          show: true,
          position: "top",
          color: slate,
          formatter: (params) => (params.dataIndex === 1 ? "约700" : params.value),
        },
      },
    ],
  });

  init("chart-profit-model", {
    tooltip: {
      formatter: (params) => params.dataType === "node" ? params.name.replace(/\n/g, "<br>") : "",
    },
    series: [
      {
        type: "graph",
        layout: "none",
        roam: false,
        symbol: "roundRect",
        edgeSymbol: ["none", "arrow"],
        edgeSymbolSize: [0, 10],
        label: {
          show: true,
          color: "#ffffff",
          fontSize: 13,
          fontWeight: 800,
          lineHeight: 18,
          formatter: "{b}",
        },
        lineStyle: {
          color: "#94A3B8",
          width: 2,
          curveness: 0.08,
        },
        data: [
          { name: "品牌 × 二次元IP\n联名", x: 60, y: 210, symbolSize: [146, 62], itemStyle: { color: blue } },
          { name: "产品差异化\n限定设计/实体周边", x: 278, y: 82, symbolSize: [166, 62], itemStyle: { color: sky } },
          { name: "粉丝情感认同", x: 278, y: 210, symbolSize: [136, 58], itemStyle: { color: teal } },
          { name: "社交传播增加\n热搜与话题", x: 278, y: 338, symbolSize: [156, 62], itemStyle: { color: orange } },
          { name: "官方售价提升\n定价能力", x: 520, y: 82, symbolSize: [150, 60], itemStyle: { color: blueDeep } },
          { name: "全网曝光\n品牌关注度", x: 520, y: 210, symbolSize: [136, 58], itemStyle: { color: rose } },
          { name: "收藏需求\n二级市场溢价", x: 520, y: 338, symbolSize: [156, 62], itemStyle: { color: amber } },
          { name: "品牌形象提升\n年轻化", x: 760, y: 210, symbolSize: [156, 66], itemStyle: { color: "#0F766E" } },
        ],
        links: [
          { source: "品牌 × 二次元IP\n联名", target: "产品差异化\n限定设计/实体周边" },
          { source: "品牌 × 二次元IP\n联名", target: "粉丝情感认同" },
          { source: "品牌 × 二次元IP\n联名", target: "社交传播增加\n热搜与话题" },
          { source: "产品差异化\n限定设计/实体周边", target: "官方售价提升\n定价能力" },
          { source: "粉丝情感认同", target: "全网曝光\n品牌关注度" },
          { source: "社交传播增加\n热搜与话题", target: "收藏需求\n二级市场溢价" },
          { source: "官方售价提升\n定价能力", target: "品牌形象提升\n年轻化" },
          { source: "全网曝光\n品牌关注度", target: "品牌形象提升\n年轻化" },
          { source: "收藏需求\n二级市场溢价", target: "品牌形象提升\n年轻化" },
        ],
      },
    ],
  });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => charts.forEach((chart) => chart.resize()), 120);
  });
}
