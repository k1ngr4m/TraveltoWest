import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import AMapLoader from "@amap/amap-jsapi-loader";
import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Camera,
  Car,
  CheckCircle2,
  Clock3,
  CloudSun,
  Compass,
  Copy,
  Droplets,
  HeartPulse,
  Landmark,
  Luggage,
  Map,
  MapPinned,
  Mountain,
  Navigation,
  Plane,
  ShieldCheck,
  Sparkles,
  Thermometer,
  WalletCards,
  Wind
} from "lucide-react";
import "./styles.css";

const imageUrls = {
  hero:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=80",
  route:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80",
  meadow:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80",
  lake:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=80",
  road:
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1800&q=80"
};

const navItems = [
  ["总览", "hero"],
  ["决策", "decision"],
  ["行程", "timeline"],
  ["地图", "route-map"],
  ["天气", "weather"],
  ["备选", "backup"],
  ["交通", "transport"],
  ["预算", "budget"],
  ["拍照", "photo"],
  ["风险", "risk"]
];

const coreDecisions = [
  {
    icon: Plane,
    label: "大交通",
    title: "杭州飞成都入，返程优先亚丁飞出",
    detail: "先睡低海拔，少一次成都大回撤；若回程票不合适，再切回成都往返。"
  },
  {
    icon: Car,
    label: "当地交通",
    title: "6 人团队优先带司机包车",
    detail: "山路、高海拔、连续长车程和摄影停靠叠加，安全和体力收益高于省下的车费。"
  },
  {
    icon: Mountain,
    label: "亚丁玩法",
    title: "短线/中线为团队目标",
    detail: "珍珠海、冲古寺、洛绒牛场是全员保底；牛奶海、五色海只给状态最好的人自选。"
  },
  {
    icon: HeartPulse,
    label: "高反策略",
    title: "首晚成都缓冲，前两天只适应",
    detail: "先删鱼子西、墨石和长线，不删成都首晚、亚丁短线和海拔梯度。"
  }
];

const itinerary = [
  {
    day: "D1",
    date: "05/28 周四",
    route: "杭州 → 成都",
    stay: "成都",
    altitude: "约 10m → 500m",
    drive: "飞行 3-3.5h，机场到市区 0.5-1h",
    highlights: "成都城市夜景，宽窄巷子/春熙路二选一",
    photo: "18:00-20:30，城市街景、巷子灯光",
    note: "缓冲夜，不喝酒、不熬夜、不安排大强度步行。"
  },
  {
    day: "D2",
    date: "05/29 周五",
    route: "成都 → 新都桥",
    stay: "新都桥",
    altitude: "500m → 3300m，途中最高约 4200m+",
    drive: "总车程约 6.5-8h",
    highlights: "雅安、泸定、康定、折多山远眺、新都桥村落光影",
    photo: "17:30-19:30，新都桥河谷、木屋、草甸",
    note: "今天只做适应，不建议上来就冲鱼子西。"
  },
  {
    day: "D3",
    date: "05/30 周六",
    route: "新都桥 → 香格里拉镇",
    stay: "香格里拉镇",
    altitude: "3300m → 2900m，途中经 4600m 级别垭口",
    drive: "总车程约 7-8.5h",
    highlights: "天路十八弯、理塘草原感、姊妹湖",
    photo: "16:30-18:30，姊妹湖观景点和草原路感镜头",
    note: "过高点但睡低点，为亚丁核心日留体力。"
  },
  {
    day: "D4",
    date: "05/31 周日",
    route: "香格里拉镇 → 亚丁景区 → 香格里拉镇",
    stay: "香格里拉镇",
    altitude: "2900m → 3900m/4100m，长线更高",
    drive: "酒店到景区 10-20min，观光车约 1h",
    highlights: "冲古寺、珍珠海，状态好再加洛绒牛场",
    photo: "08:30-11:00；14:30-16:30，珍珠海倒影、冲古草甸、洛绒牛场",
    note: "有人头痛、胸闷、呕吐，立刻缩线路。"
  },
  {
    day: "D5",
    date: "06/01 周一",
    route: "香格里拉镇 → 稻城",
    stay: "稻城",
    altitude: "2900m → 3700m",
    drive: "1-1.5h 车程 + 轻机位停靠",
    highlights: "稻城白塔、傍河轻旅拍",
    photo: "17:30-19:30，白塔前景、河谷、道路延伸感",
    note: "如果前一晚反应明显，D5 改成恢复日。"
  },
  {
    day: "D6",
    date: "06/02 周二",
    route: "稻城 → 亚丁机场 → 成都 → 杭州",
    stay: "返程",
    altitude: "3700m → 机场高海拔 → 回低海拔",
    drive: "稻城到机场约 1-1.5h，飞行 + 中转",
    highlights: "赶航班为主，不再加硬景点",
    photo: "有余裕再拍沿途公路和云层",
    note: "联程至少预留 3.5 小时以上缓冲。"
  }
];

const backupRoutes = [
  {
    title: "低强度亚丁保底线",
    subtitle: "预算更低、天气一般、有人担心高反时使用",
    points: [
      "D2 只到康定，把第二晚压到约 2560m。",
      "D3 康定到新都桥，只保新都桥日落，墨石/塔公二选一。",
      "D5 亚丁只做冲古寺 + 珍珠海，状态好再加洛绒牛场。"
    ]
  },
  {
    title: "四姑娘山/丹巴应急线",
    subtitle: "亚丁方向暴雨、管制或高反明显时切换",
    points: [
      "新都桥转塔公、八美、丹巴，海拔降到更舒服的区间。",
      "甲居藏寨做人文建筑摄影，双桥沟坐观光车看森林雪山。",
      "D5 回成都，医疗、航班和休整冗余更高。"
    ]
  }
];

const transportComparisons = [
  {
    title: "杭州 ⇄ 成都",
    score: "最稳",
    details: ["约 3-3.5h 飞行", "常见往返 ¥1100-2300/人", "第一晚低海拔，舒适度高"]
  },
  {
    title: "杭州 → 亚丁机场",
    score: "不建议去程",
    details: ["中转总耗时约 6.5-10h", "常见 ¥2600-4800/人", "落地即高海拔，高反风险高"]
  },
  {
    title: "带司机包车",
    score: "推荐",
    details: ["6 天约 ¥11100-15900", "人均 ¥1850-2650", "拍照停车、安全、疲劳管理更好"]
  },
  {
    title: "纯租车自驾",
    score: "谨慎",
    details: ["6 天约 ¥4870-8370", "人均 ¥812-1395", "省钱，但司机承受山路和高反叠加压力"]
  }
];

const budgets = [
  {
    name: "经济版",
    total: "¥33300",
    per: "¥5550",
    pair: "¥11100",
    deposit: "¥3000/人",
    tone: "能省则省"
  },
  {
    name: "均衡版",
    total: "¥45600",
    per: "¥7600",
    pair: "¥15200",
    deposit: "¥4500/人",
    tone: "最推荐"
  },
  {
    name: "舒适版",
    total: "¥62100",
    per: "¥10350",
    pair: "¥20700",
    deposit: "¥6000/人",
    tone: "吃住更稳"
  }
];

const photoSpots = [
  {
    name: "稻城亚丁短线",
    rating: "5/5",
    color: "雪山蓝白、湖水绿",
    outfit: "白、奶油、雾蓝、酒红",
    timing: "上午 8:30-11:00",
    note: "全员保底路线，珍珠海倒影最稳。"
  },
  {
    name: "洛绒牛场",
    rating: "4.8/5",
    color: "草甸绿、雪山灰白",
    outfit: "白、焦糖、姜黄、浅灰",
    timing: "14:30-16:30",
    note: "适合广角大场景，状态好再加。"
  },
  {
    name: "新都桥",
    rating: "4.8/5",
    color: "金色、绿色、木屋棕",
    outfit: "米白、酒红、卡其、牛仔蓝",
    timing: "早晨、傍晚",
    note: "沿途最稳出片地。"
  },
  {
    name: "鱼子西",
    rating: "4.7/5",
    color: "雪山金色、晚霞粉紫",
    outfit: "白、红、黑、奶茶色",
    timing: "日落前后",
    note: "高位点，状态不好时优先删。"
  },
  {
    name: "墨石公园",
    rating: "4.4/5",
    color: "黑灰、异星地貌色",
    outfit: "白、银灰、亮红、克莱因蓝",
    timing: "10:00-16:00",
    note: "风格差异大，天气不好可删。"
  },
  {
    name: "稻城白塔",
    rating: "4.3/5",
    color: "白金、天青、草甸绿",
    outfit: "黑白、焦糖、奶茶色",
    timing: "17:30-19:30",
    note: "D5 恢复日轻松好拍。"
  }
];

const risks = [
  {
    icon: HeartPulse,
    title: "高原反应",
    content: "前两天不喝酒、不熬夜、不剧烈跑跳。持续头痛、胸闷、恶心时先缩线路，必要时下撤并就医。"
  },
  {
    icon: AlertTriangle,
    title: "天气变化",
    content: "川西常见上午晴、下午风雨冰雹。雨壳、保暖层、墨镜和防晒必须随身。"
  },
  {
    icon: Car,
    title: "路况风险",
    content: "折多山、理塘方向可能有施工、落石、临时管制。日落点必须留弹性。"
  },
  {
    icon: Plane,
    title: "航班风险",
    content: "亚丁方向航班受天气影响更敏感，回程联程不要压极限中转。"
  }
];

const checklist = [
  "航班班次、退改规则和联程缓冲",
  "酒店双床房、取消政策、停车和集合点",
  "包车车型、司机食宿、过路停车、行李空间",
  "稻城亚丁门票、观光车、电瓶车和开放时间",
  "成都、康定、新都桥、香格里拉镇、亚丁 7 日天气",
  "折多山、理塘方向施工或临时管制",
  "全员健康状态、药品、氧气、保险和证件截图"
];

const weatherLocations = [
  {
    label: "成都",
    envKey: "VITE_WEATHER_LOCATION_CHENGDU",
    locations: ["chengdu"],
    stay: "D1 住宿地",
    role: "低海拔缓冲"
  },
  {
    label: "新都桥",
    envKey: "VITE_WEATHER_LOCATION_XINDUQIAO",
    locations: ["xinduqiao", "kangding"],
    stay: "D2 住宿地",
    role: "高原适应"
  },
  {
    label: "香格里拉镇",
    envKey: "VITE_WEATHER_LOCATION_SHANGRILA_TOWN",
    locations: ["xianggelilazhen", "daocheng", "ganzi", "kangding"],
    stay: "D3-D4 住宿地",
    role: "亚丁前夜"
  },
  {
    label: "稻城",
    envKey: "VITE_WEATHER_LOCATION_DAOCHENG",
    locations: ["daocheng", "ganzi", "kangding"],
    stay: "D5 住宿地",
    role: "返程前夜"
  }
];

const routeNodes = [
  {
    day: "D1",
    name: "成都",
    summary: "杭州飞成都入，首晚低海拔缓冲。",
    stay: "成都",
    altitude: "约 500m",
    position: [104.0665, 30.5723]
  },
  {
    day: "D2",
    name: "新都桥",
    summary: "成都经康定进入摄影天堂，只做适应。",
    stay: "新都桥",
    altitude: "约 3300m",
    position: [101.495, 30.033]
  },
  {
    day: "D3-D4",
    name: "香格里拉镇",
    summary: "亚丁前夜住宿点，睡低一点给核心日留体力。",
    stay: "香格里拉镇",
    altitude: "约 2900m",
    position: [100.344, 28.559]
  },
  {
    day: "D4",
    name: "稻城亚丁景区",
    summary: "冲古寺、珍珠海、洛绒牛场为全员保底。",
    stay: "景区往返",
    altitude: "3900m+",
    position: [100.297, 28.445]
  },
  {
    day: "D5",
    name: "稻城",
    summary: "白塔和傍河轻旅拍，作为恢复和返程前夜。",
    stay: "稻城",
    altitude: "约 3700m",
    position: [100.298, 29.037]
  },
  {
    day: "D6",
    name: "稻城亚丁机场",
    summary: "返程优先从亚丁机场飞出，减少大回撤。",
    stay: "返程",
    altitude: "约 4411m",
    position: [100.053, 29.323]
  }
];

const dailyRouteSegments = [
  {
    day: "D1",
    title: "杭州 → 成都",
    transport: "飞机 + 市区轻活动",
    duration: "飞行约 3-3.5h；机场到市区 0.5-1h",
    altitude: "约 10m → 500m",
    focus: "低海拔缓冲，不赶景点。",
    note: "落地后只安排轻松活动，晚上早点休息。",
    points: [
      { name: "杭州萧山机场", position: [120.432, 30.236] },
      { name: "成都", position: [104.0665, 30.5723] }
    ]
  },
  {
    day: "D2",
    title: "成都 → 新都桥",
    transport: "包车公路进入川西",
    duration: "总车程约 6.5-8h",
    altitude: "500m → 3300m，途中最高约 4200m+",
    focus: "先适应高海拔，不冲高位日落点。",
    note: "经雅安、泸定、康定，折多山只短暂停留。",
    points: [
      { name: "成都", position: [104.0665, 30.5723] },
      { name: "雅安", position: [103.001, 29.987] },
      { name: "泸定", position: [102.234, 29.914] },
      { name: "康定", position: [101.964, 30.05] },
      { name: "新都桥", position: [101.495, 30.033] }
    ]
  },
  {
    day: "D3",
    title: "新都桥 → 香格里拉镇",
    transport: "包车穿越理塘方向",
    duration: "总车程约 7-8.5h",
    altitude: "3300m → 2900m，途中经 4600m 级别垭口",
    focus: "过高点、睡低点，为亚丁日储备体力。",
    note: "重点拍天路十八弯、理塘草原感、姊妹湖。",
    points: [
      { name: "新都桥", position: [101.495, 30.033] },
      { name: "雅江", position: [101.015, 30.031] },
      { name: "理塘", position: [100.269, 29.996] },
      { name: "姊妹湖", position: [99.65, 30.03] },
      { name: "香格里拉镇", position: [100.344, 28.559] }
    ]
  },
  {
    day: "D4",
    title: "香格里拉镇 → 亚丁景区 → 香格里拉镇",
    transport: "短车程 + 景区观光车 + 步行",
    duration: "酒店到景区 10-20min；观光车约 1h；步行 1-3h",
    altitude: "2900m → 3900m/4100m，长线更高",
    focus: "冲古寺、珍珠海、洛绒牛场为核心。",
    note: "有人头痛、胸闷、呕吐，立刻缩线路。",
    points: [
      { name: "香格里拉镇", position: [100.344, 28.559] },
      { name: "亚丁游客中心", position: [100.331, 28.54] },
      { name: "稻城亚丁景区", position: [100.297, 28.445] },
      { name: "香格里拉镇", position: [100.344, 28.559] }
    ]
  },
  {
    day: "D5",
    title: "香格里拉镇 → 稻城",
    transport: "短途回撤 + 轻旅拍",
    duration: "1-1.5h 车程 + 轻机位停靠",
    altitude: "2900m → 3700m",
    focus: "恢复日，拍稻城白塔和傍河。",
    note: "如果前一晚高反明显，就减少所有高位停靠。",
    points: [
      { name: "香格里拉镇", position: [100.344, 28.559] },
      { name: "稻城白塔", position: [100.285, 29.036] },
      { name: "稻城", position: [100.298, 29.037] }
    ]
  },
  {
    day: "D6",
    title: "稻城 → 亚丁机场 → 成都 → 杭州",
    transport: "包车接驳 + 联程航班",
    duration: "稻城到机场约 1-1.5h；飞行 + 中转",
    altitude: "3700m → 机场高海拔 → 回低海拔",
    focus: "只赶航班，不加硬景点。",
    note: "联程至少预留 3.5 小时以上缓冲。",
    points: [
      { name: "稻城", position: [100.298, 29.037] },
      { name: "稻城亚丁机场", position: [100.053, 29.323] },
      { name: "成都", position: [104.0665, 30.5723] },
      { name: "杭州", position: [120.155, 30.274] }
    ]
  }
];

function getAmapConfig() {
  return {
    key: import.meta.env.VITE_AMAP_KEY,
    securityCode: import.meta.env.VITE_AMAP_SECURITY_CODE
  };
}

function hasAmapConfig() {
  const { key, securityCode } = getAmapConfig();
  return Boolean(key && key !== "your_amap_key" && securityCode && securityCode !== "your_amap_security_code");
}

async function loadAmap() {
  const { key, securityCode } = getAmapConfig();
  window._AMapSecurityConfig = {
    securityJsCode: securityCode
  };

  return AMapLoader.load({
    key,
    version: "2.0",
    plugins: []
  });
}

const SENIVERSE_BASE_URL = "https://api.seniverse.com/v3/weather";
const SENIVERSE_LOCATION_URL = "https://api.seniverse.com/v3/location/search.json";

function getWeatherApiKey() {
  const key = import.meta.env.VITE_SENIVERSE_API_KEY;
  return key && key !== "your_api_key" ? key : "";
}

async function fetchSeniverseWeather(endpoint, location, params = {}) {
  const key = getWeatherApiKey();
  if (!key) {
    throw new Error("请先在 .env 中填写 VITE_SENIVERSE_API_KEY。");
  }

  const searchParams = new URLSearchParams({
    key,
    location,
    language: "zh-Hans",
    unit: "c",
    ...params
  });

  const response = await fetch(`${SENIVERSE_BASE_URL}/${endpoint}.json?${searchParams}`);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.status || payload?.message || `天气接口请求失败（${response.status}）`;
    throw new Error(message);
  }

  const result = payload?.results?.[0];
  if (!result) {
    throw new Error("天气接口没有返回可用数据。");
  }

  return result;
}

async function searchSeniverseLocations(query, limit = 10, offset = 0) {
  const key = getWeatherApiKey();
  if (!key) {
    throw new Error("请先在 .env 中填写 VITE_SENIVERSE_API_KEY。");
  }

  const searchParams = new URLSearchParams({
    key,
    q: query,
    language: "zh-Hans",
    limit: String(limit),
    offset: String(offset)
  });

  const response = await fetch(`${SENIVERSE_LOCATION_URL}?${searchParams}`);
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.status || payload?.message || `城市搜索失败（${response.status}）`;
    throw new Error(message);
  }

  return payload?.results || [];
}

function fetchWeatherNow(location) {
  return fetchSeniverseWeather("now", location);
}

function fetchWeatherDaily(location, days = 5) {
  return fetchSeniverseWeather("daily", location, {
    start: "0",
    days: String(days)
  });
}

async function fetchWeatherBundle(location) {
  const [nowResult, dailyResult] = await Promise.all([
    fetchWeatherNow(location),
    fetchWeatherDaily(location)
  ]);

  return {
    now: nowResult.now,
    daily: dailyResult.daily || [],
    location: nowResult.location,
    lastUpdate: nowResult.last_update || dailyResult.last_update,
    queryLocation: location,
    isFallback: false
  };
}

function resolveWeatherLocations(item) {
  const override = import.meta.env[item.envKey];
  return [...new Set([override, ...item.locations].filter(Boolean))];
}

async function fetchWeatherBundleWithFallback(item) {
  const candidates = resolveWeatherLocations(item);
  const errors = [];

  for (const location of candidates) {
    try {
      const weatherBundle = await fetchWeatherBundle(location);
      return {
        ...weatherBundle,
        isFallback: location !== candidates[0]
      };
    } catch (error) {
      errors.push(`${location}: ${getWeatherErrorMessage(error)}`);
    }
  }

  throw new Error(errors.join("；"));
}

function getWeatherErrorMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("location can not be found")) return "地点无法识别";
  if (message.includes("don't have access")) return "账号无该城市权限";
  return message || "天气数据加载失败";
}

function Section({ id, label, title, eyebrow, image, children, className = "" }) {
  return (
    <section
      id={id}
      className={`slide ${className}`}
      style={image ? { "--bg-image": `url(${image})` } : undefined}
    >
      <div className="slide__scrim" />
      <div className="slide__inner">
        <p className="eyebrow">{eyebrow || label}</p>
        <div className="section-heading">
          <h2>{title}</h2>
          <span>{label}</span>
        </div>
        {children}
      </div>
    </section>
  );
}

function HeroSlide() {
  return (
    <section
      id="hero"
      className="slide hero"
      style={{ "--bg-image": `url(${imageUrls.hero})` }}
    >
      <div className="slide__scrim" />
      <div className="hero__content">
        <p className="eyebrow">查询日期 2026-04-30 · 6 人 · 6 天 5 晚</p>
        <h1>川西稻城亚丁路线决策展示</h1>
        <p className="hero__lead">
          主线采用“杭州飞成都入、首晚低海拔缓冲、带司机包车、公路进亚丁、返程优先亚丁飞出”。
          这不是塞满景点的攻略，而是把高反、安全、预算和出片率一起算进去的团队决策页。
        </p>
        <div className="hero__actions">
          <a href="#decision" className="primary-link">
            查看核心决策 <ArrowRight size={18} />
          </a>
          <a href="#timeline" className="ghost-link">
            看 D1-D6 路线
          </a>
        </div>
        <div className="hero__metrics">
          <Metric value="¥7600" label="均衡版人均建议预算" />
          <Metric value="2900m" label="亚丁前夜睡眠海拔" />
          <Metric value="3.5h+" label="返程联程缓冲" />
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function DecisionSlide() {
  return (
    <Section
      id="decision"
      label="路线决策"
      title="先保身体，再保风景，最后才是多打卡"
      image={imageUrls.route}
    >
      <div className="decision-grid">
        {coreDecisions.map((item) => {
          const Icon = item.icon;
          return (
            <article className="decision-card" key={item.title}>
              <div className="icon-badge">
                <Icon size={24} />
              </div>
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </article>
          );
        })}
      </div>
      <div className="decision-strip">
        <CheckCircle2 size={20} />
        <p>
          冲突口径已合并：主结论以 plan1 为准；plan2 的长线挑战改为“状态好成员可选”，不作为全员刚性目标。
        </p>
      </div>
    </Section>
  );
}

function TimelineSlide() {
  return (
    <Section
      id="timeline"
      label="主推荐行程"
      title="D1-D6：低海拔缓冲，公路进亚丁，轻松回撤"
      image={imageUrls.meadow}
    >
      <div className="timeline">
        {itinerary.map((day) => (
          <article className="day-card" key={day.day}>
            <div className="day-card__top">
              <strong>{day.day}</strong>
              <span>{day.date}</span>
            </div>
            <h3>{day.route}</h3>
            <div className="tag-row">
              <span>{day.stay}</span>
              <span>{day.altitude}</span>
            </div>
            <p>{day.highlights}</p>
            <dl>
              <div>
                <dt>车程/交通</dt>
                <dd>{day.drive}</dd>
              </div>
              <div>
                <dt>拍摄窗口</dt>
                <dd>{day.photo}</dd>
              </div>
              <div>
                <dt>注意</dt>
                <dd>{day.note}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </Section>
  );
}

function RouteMapSlide() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const AMapRef = useRef(null);
  const baseRouteOverlaysRef = useRef([]);
  const activeRouteOverlaysRef = useRef([]);
  const [mapState, setMapState] = useState({
    status: hasAmapConfig() ? "loading" : "missing",
    message: ""
  });
  const [activeRouteDay, setActiveRouteDay] = useState("all");

  const activeRoute =
    activeRouteDay === "all"
      ? null
      : dailyRouteSegments.find((route) => route.day === activeRouteDay);

  function clearActiveRouteOverlays() {
    const map = mapInstanceRef.current;
    if (map && activeRouteOverlaysRef.current.length) {
      map.remove(activeRouteOverlaysRef.current);
    }
    activeRouteOverlaysRef.current = [];
  }

  function focusRoute(route) {
    const map = mapInstanceRef.current;
    const AMap = AMapRef.current;

    setActiveRouteDay(route ? route.day : "all");
    clearActiveRouteOverlays();

    if (!map || !AMap) return;

    if (!route) {
      map.setFitView(baseRouteOverlaysRef.current, false, [80, 80, 80, 80]);
      return;
    }

    const path = route.points.map((point) => point.position);
    const line = new AMap.Polyline({
      path,
      strokeColor: "#276d91",
      strokeOpacity: 0.95,
      strokeWeight: 8,
      lineJoin: "round",
      showDir: true,
      zIndex: 80
    });

    const markers = route.points.map((point, index) => {
      return new AMap.Marker({
        position: point.position,
        title: point.name,
        label: {
          direction: "top",
          offset: new AMap.Pixel(0, -8),
          content: `<div class="amap-node-label active">${index + 1}. ${point.name}</div>`
        },
        zIndex: 90
      });
    });

    const overlays = [line, ...markers];
    activeRouteOverlaysRef.current = overlays;
    map.add(overlays);
    map.setFitView(overlays, false, [90, 90, 90, 90]);
  }

  useEffect(() => {
    if (!hasAmapConfig()) {
      setMapState({ status: "missing", message: "" });
      return undefined;
    }

    let isActive = true;
    setMapState({ status: "loading", message: "" });

    loadAmap()
      .then((AMap) => {
        if (!isActive || !mapContainerRef.current) return;
        AMapRef.current = AMap;

        const map = new AMap.Map(mapContainerRef.current, {
          zoom: 7,
          center: [101.8, 29.55],
          viewMode: "2D",
          mapStyle: "amap://styles/normal"
        });

        const path = routeNodes.map((node) => node.position);
        const polyline = new AMap.Polyline({
          path,
          strokeColor: "#9f3d38",
          strokeOpacity: 0.9,
          strokeWeight: 6,
          lineJoin: "round",
          showDir: true
        });

        map.add(polyline);

        const markers = routeNodes.map((node, index) => {
          const marker = new AMap.Marker({
            position: node.position,
            title: node.name,
            label: {
              direction: "top",
              offset: new AMap.Pixel(0, -8),
              content: `<div class="amap-node-label">${index + 1}. ${node.name}</div>`
            }
          });

          marker.on("click", () => {
            const infoWindow = new AMap.InfoWindow({
              offset: new AMap.Pixel(0, -28),
              content: `<div class="amap-info"><strong>${node.day} · ${node.name}</strong><p>${node.summary}</p><span>${node.altitude}</span></div>`
            });
            infoWindow.open(map, node.position);
          });

          return marker;
        });

        map.add(markers);
        baseRouteOverlaysRef.current = [polyline, ...markers];
        map.setFitView([polyline, ...markers], false, [80, 80, 80, 80]);
        mapInstanceRef.current = map;

        setMapState({ status: "success", message: "" });
      })
      .catch((error) => {
        if (!isActive) return;
        setMapState({
          status: "error",
          message: error instanceof Error ? error.message : "高德地图加载失败。"
        });
      });

    return () => {
      isActive = false;
      if (mapInstanceRef.current) {
        clearActiveRouteOverlays();
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
      AMapRef.current = null;
      baseRouteOverlaysRef.current = [];
    };
  }, []);

  return (
    <Section
      id="route-map"
      label="路线地图"
      title="把 6 天主线放到地图上看"
      image={imageUrls.route}
    >
      <div className="route-map-layout">
        <div className="route-map-card">
          <div ref={mapContainerRef} className="route-map-canvas" />
          {mapState.status !== "success" && (
            <div className={`route-map-overlay ${mapState.status}`}>
              {mapState.status === "missing" && (
                <>
                  <MapPinned size={28} />
                  <h3>请填写高德地图 Key</h3>
                  <p>
                    在 <code>.env</code> 中配置 <code>VITE_AMAP_KEY</code> 和
                    <code>VITE_AMAP_SECURITY_CODE</code> 后重启 Vite。前端接入会在浏览器中暴露 key，适合个人展示页。
                  </p>
                </>
              )}
              {mapState.status === "loading" && (
                <>
                  <Navigation size={28} />
                  <h3>正在加载高德地图...</h3>
                  <p>加载完成后会显示成都到亚丁机场的主线节点。</p>
                </>
              )}
              {mapState.status === "error" && (
                <>
                  <AlertTriangle size={28} />
                  <h3>地图加载失败</h3>
                  <p>{mapState.message}</p>
                </>
              )}
            </div>
          )}
        </div>

        <aside className="route-map-panel">
          <div className="route-map-panel__head">
            <MapPinned size={24} />
            <div>
              <h3>主线节点</h3>
              <p>节点连线用于展示空间关系，不代表精确驾车导航线路。</p>
            </div>
          </div>

          <div className="route-map-actions">
            <button
              type="button"
              className={activeRouteDay === "all" ? "active" : ""}
              onClick={() => focusRoute(null)}
            >
              总览
            </button>
            {dailyRouteSegments.map((route) => (
              <button
                type="button"
                key={route.day}
                className={activeRouteDay === route.day ? "active" : ""}
                onClick={() => focusRoute(route)}
              >
                {route.day}
              </button>
            ))}
          </div>

          {activeRoute && (
            <article className="route-day-detail">
              <span>{activeRoute.day} 详细路线</span>
              <h3>{activeRoute.title}</h3>
              <dl>
                <div>
                  <dt>交通方式</dt>
                  <dd>{activeRoute.transport}</dd>
                </div>
                <div>
                  <dt>时间</dt>
                  <dd>{activeRoute.duration}</dd>
                </div>
                <div>
                  <dt>海拔</dt>
                  <dd>{activeRoute.altitude}</dd>
                </div>
                <div>
                  <dt>重点</dt>
                  <dd>{activeRoute.focus}</dd>
                </div>
              </dl>
              <p>{activeRoute.note}</p>
              <div className="route-point-chain">
                {activeRoute.points.map((point) => (
                  <span key={`${activeRoute.day}-${point.name}`}>{point.name}</span>
                ))}
              </div>
            </article>
          )}

          <ol className="route-node-list">
            {routeNodes.map((node) => (
              <li key={`${node.day}-${node.name}`}>
                <span>{node.day}</span>
                <div>
                  <strong>{node.name}</strong>
                  <p>{node.summary}</p>
                  <em>{node.stay} · {node.altitude}</em>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </Section>
  );
}

function WeatherSlide() {
  const apiKey = getWeatherApiKey();
  const [weatherByLocation, setWeatherByLocation] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchState, setSearchState] = useState({
    status: "idle",
    results: [],
    message: ""
  });
  const [searchedWeather, setSearchedWeather] = useState({
    status: "idle",
    city: null,
    message: ""
  });

  const locations = useMemo(() => weatherLocations, []);

  useEffect(() => {
    if (!apiKey) {
      setWeatherByLocation({});
      return;
    }

    let isActive = true;
    setWeatherByLocation(
      Object.fromEntries(locations.map((item) => [item.label, { status: "loading" }]))
    );

    locations.forEach(async (item) => {
      try {
        const weatherBundle = await fetchWeatherBundleWithFallback(item);

        if (!isActive) return;
        setWeatherByLocation((current) => ({
          ...current,
          [item.label]: {
            status: "success",
            ...weatherBundle
          }
        }));
      } catch (error) {
        if (!isActive) return;
        setWeatherByLocation((current) => ({
          ...current,
          [item.label]: {
            status: "error",
            error: error instanceof Error ? error.message : "天气数据加载失败。"
          }
        }));
      }
    });

    return () => {
      isActive = false;
    };
  }, [apiKey, locations]);

  async function handleLocationSearch(event) {
    event.preventDefault();
    const query = searchQuery.trim();

    if (!apiKey) {
      setSearchState({
        status: "error",
        results: [],
        message: "请先填写 VITE_SENIVERSE_API_KEY。"
      });
      return;
    }

    if (!query) {
      setSearchState({
        status: "error",
        results: [],
        message: "请输入城市 ID、中文、英文、拼音、IP 或经纬度。"
      });
      return;
    }

    setSearchState({ status: "loading", results: [], message: "" });
    setSearchedWeather({ status: "idle", city: null, message: "" });

    try {
      const results = await searchSeniverseLocations(query);
      setSearchState({
        status: "success",
        results,
        message: results.length ? "" : "没有找到匹配城市。"
      });

      if (results[0]) {
        handleSearchWeather(results[0]);
      }
    } catch (error) {
      setSearchState({
        status: "error",
        results: [],
        message: getWeatherErrorMessage(error)
      });
    }
  }

  async function handleSearchWeather(city) {
    setSearchedWeather({
      status: "loading",
      city,
      message: ""
    });

    try {
      const weatherBundle = await fetchWeatherBundle(city.id);
      setSearchedWeather({
        status: "success",
        city,
        message: "",
        ...weatherBundle
      });
    } catch (error) {
      setSearchedWeather({
        status: "error",
        city,
        message: getWeatherErrorMessage(error)
      });
    }
  }

  return (
    <Section
      id="weather"
      label="实时天气"
      title="把住宿地天气放到行程中间看"
      image={imageUrls.lake}
    >
      {!apiKey && (
        <div className="weather-key-panel">
          <CloudSun size={24} />
          <div>
            <h3>请填写天气 API Key</h3>
            <p>
              在项目根目录创建 <code>.env</code>，写入
              <code>VITE_SENIVERSE_API_KEY=你的心知天气密钥</code> 后重启开发服务器。
              前端直连会在浏览器请求中暴露 key，适合个人演示使用。
              若地点识别不准，可用 <code>VITE_WEATHER_LOCATION_*</code> 覆盖查询地点。
            </p>
          </div>
        </div>
      )}

      <LocationSearchPanel
        apiKey={apiKey}
        query={searchQuery}
        searchState={searchState}
        searchedWeather={searchedWeather}
        onQueryChange={setSearchQuery}
        onSearch={handleLocationSearch}
        onShowWeather={handleSearchWeather}
      />

      <div className="weather-grid">
        {locations.map((item) => (
          <WeatherCard
            key={item.label}
            meta={item}
            state={weatherByLocation[item.label] || { status: apiKey ? "loading" : "idle" }}
          />
        ))}
      </div>

      <div className="fixed-note weather-note">
        天气为心知天气实时接口返回；逐日预报按账号权限展示可用天数，免费版可能只返回 3 天。
        新都桥、香格里拉镇、稻城若无法识别或无权限，会自动尝试康定/甘孜等参考地点。
      </div>
    </Section>
  );
}

function LocationSearchPanel({
  apiKey,
  query,
  searchState,
  searchedWeather,
  onQueryChange,
  onSearch,
  onShowWeather
}) {
  return (
    <div className="location-search-panel">
      <form onSubmit={onSearch}>
        <div>
          <h3>城市搜索</h3>
          <p>支持城市 ID、中文、英文、拼音缩写、IP、经纬度和省市名称限定搜索。</p>
        </div>
        <div className="location-search-box">
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="例如：北京 / beijing / bj / 39.93:116.40"
            disabled={!apiKey}
          />
          <button type="submit" disabled={!apiKey || searchState.status === "loading"}>
            {searchState.status === "loading" ? "搜索中" : "搜索"}
          </button>
        </div>
      </form>

      {!apiKey && (
        <p className="location-search-hint">填写 API key 后可用城市搜索来找到更稳定的 location ID。</p>
      )}

      {searchState.message && (
        <p className={`location-search-message ${searchState.status}`}>{searchState.message}</p>
      )}

      {searchState.results.length > 0 && (
        <div className="location-results">
          {searchState.results.map((item) => (
            <LocationResultCard key={item.id} item={item} onShowWeather={onShowWeather} />
          ))}
        </div>
      )}

      {searchedWeather.status !== "idle" && (
        <div className="searched-weather-wrap">
          <WeatherCard
            meta={{
              label: searchedWeather.city?.name || "搜索城市",
              stay: "搜索结果天气",
              role: searchedWeather.city?.path || "实时查询"
            }}
            state={
              searchedWeather.status === "error"
                ? { status: "error", error: searchedWeather.message }
                : searchedWeather
            }
          />
        </div>
      )}
    </div>
  );
}

function LocationResultCard({ item, onShowWeather }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(item.id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="location-result-card">
      <div>
        <h4>{item.name}</h4>
        <p>{item.path}</p>
        <span>{item.country} · {item.timezone} · UTC{item.timezone_offset}</span>
      </div>
      <div className="location-result-actions">
        <button type="button" onClick={() => onShowWeather(item)}>
          查看天气
        </button>
        <button type="button" onClick={handleCopy} aria-label={`复制 ${item.name} 城市 ID`}>
          <Copy size={15} />
          {copied ? "已复制" : item.id}
        </button>
      </div>
    </article>
  );
}

function WeatherCard({ meta, state }) {
  const now = state.now || {};
  const daily = state.daily || [];

  return (
    <article className={`weather-card ${state.status}`}>
      <div className="weather-card__head">
        <div>
          <span>{meta.stay}</span>
          <h3>{meta.label}</h3>
        </div>
        <strong>{meta.role}</strong>
      </div>

      {state.status === "idle" && (
        <p className="weather-state-text">等待填写 API key 后加载天气。</p>
      )}

      {state.status === "loading" && (
        <p className="weather-state-text">正在加载实时天气和逐日预报...</p>
      )}

      {state.status === "error" && (
        <div className="weather-error">
          <AlertTriangle size={18} />
          <p>{state.error}</p>
        </div>
      )}

      {state.status === "success" && (
        <>
          <div className="weather-now">
            <CloudSun size={28} />
            <div>
              <span>{now.text || "天气未知"}</span>
              <strong>{now.temperature ? `${now.temperature}℃` : "--"}</strong>
            </div>
          </div>

          <div className="weather-facts">
            <WeatherFact icon={Thermometer} label="体感" value={formatWeatherValue(now.feels_like, "℃")} />
            <WeatherFact icon={Droplets} label="湿度" value={formatWeatherValue(now.humidity, "%")} />
            <WeatherFact icon={Wind} label="风力" value={now.wind_scale ? `${now.wind_scale} 级` : "--"} />
          </div>

          <div className="forecast-list">
            {daily.map((day) => (
              <div className="forecast-row" key={day.date}>
                <span>{formatForecastDate(day.date)}</span>
                <strong>{day.high || "--"}° / {day.low || "--"}°</strong>
                <em>{day.text_day || "--"} · 夜间 {day.text_night || "--"}</em>
              </div>
            ))}
          </div>

          <p className="weather-update">
            {state.location?.name || meta.label}
            {state.isFallback ? ` 参考 · 查询 ${state.queryLocation}` : ""}
            {" · "}
            更新于 {formatUpdateTime(state.lastUpdate)}
          </p>
        </>
      )}
    </article>
  );
}

function WeatherFact({ icon: Icon, label, value }) {
  return (
    <div>
      <Icon size={16} />
      <span>{label}</span>
      <strong>{value || "--"}</strong>
    </div>
  );
}

function formatWeatherValue(value, unit) {
  return value ? `${value}${unit}` : "--";
}

function formatForecastDate(date) {
  if (!date) return "--";
  const [, month, day] = date.split("-");
  return `${month}/${day}`;
}

function formatUpdateTime(value) {
  if (!value) return "--";
  return value.replace("T", " ").slice(0, 16);
}

function BackupSlide() {
  return (
    <Section
      id="backup"
      label="备选路线"
      title="天气或身体不配合时，先降强度，不硬扛"
      image={imageUrls.road}
    >
      <div className="backup-grid">
        {backupRoutes.map((route) => (
          <article className="backup-card" key={route.title}>
            <div className="backup-card__head">
              <ShieldCheck size={24} />
              <div>
                <h3>{route.title}</h3>
                <p>{route.subtitle}</p>
              </div>
            </div>
            <ul>
              {route.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="rule-box">
        <strong>删减顺序</strong>
        <span>鱼子西、墨石公园、牛奶海/五色海优先删；成都首晚缓冲、亚丁短线、海拔梯度不建议删。</span>
      </div>
    </Section>
  );
}

function TransportCompareSlide() {
  return (
    <Section
      id="transport"
      label="交通对比"
      title="贵一点的包车，换来更高的成功率"
      image={imageUrls.lake}
    >
      <div className="compare-grid">
        {transportComparisons.map((item) => (
          <article className="compare-card" key={item.title}>
            <div>
              <h3>{item.title}</h3>
              <span>{item.score}</span>
            </div>
            <ul>
              {item.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="insight-panel">
        <Car size={22} />
        <p>
          包车比自驾约贵 ¥6230-7530，总人均约贵 ¥1038-1255。对 6 人摄影团来说，这笔差价主要买的是山路经验、驾驶疲劳管理和合法停靠便利。
        </p>
      </div>
    </Section>
  );
}

function BudgetSlide() {
  return (
    <Section
      id="budget"
      label="预算与公摊"
      title="均衡版最适合：预算可控，现场弹性够"
      image={imageUrls.route}
    >
      <div className="budget-grid">
        {budgets.map((budget) => (
          <article className={`budget-card ${budget.name === "均衡版" ? "featured" : ""}`} key={budget.name}>
            <span>{budget.tone}</span>
            <h3>{budget.name}</h3>
            <strong>{budget.per}</strong>
            <p>人均建议总预算</p>
            <dl>
              <div>
                <dt>6 人总预算</dt>
                <dd>{budget.total}</dd>
              </div>
              <div>
                <dt>每两人</dt>
                <dd>{budget.pair}</dd>
              </div>
              <div>
                <dt>公摊预付</dt>
                <dd>{budget.deposit}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <div className="wallet-panel">
        <WalletCards size={24} />
        <div>
          <h3>公摊建议：支付宝荷钱包</h3>
          <p>
            机票各自付款；车费、房费、门票、氧气和共享餐费走公摊。小陈做管理员和最终核账人，行程结束当晚多退少补。
          </p>
        </div>
      </div>
    </Section>
  );
}

function PhotoSlide() {
  return (
    <Section
      id="photo"
      label="拍照与穿搭"
      title="按景点色彩选衣服，出片率会很明显"
      image={imageUrls.meadow}
    >
      <div className="photo-grid">
        {photoSpots.map((spot) => (
          <article className="photo-card" key={spot.name}>
            <div className="photo-card__meta">
              <Camera size={20} />
              <span>{spot.rating}</span>
            </div>
            <h3>{spot.name}</h3>
            <p>{spot.note}</p>
            <div className="swatch-row">
              {spot.outfit.split("、").slice(0, 4).map((color) => (
                <span key={color}>{color}</span>
              ))}
            </div>
            <dl>
              <div>
                <dt>主调</dt>
                <dd>{spot.color}</dd>
              </div>
              <div>
                <dt>时间</dt>
                <dd>{spot.timing}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </Section>
  );
}

function RiskSlide() {
  return (
    <Section
      id="risk"
      label="风险与复核"
      title="出发前 7 天，把不确定项全部再确认一次"
      image={imageUrls.road}
    >
      <div className="risk-layout">
        <div className="risk-grid">
          {risks.map((risk) => {
            const Icon = risk.icon;
            return (
              <article className="risk-card" key={risk.title}>
                <Icon size={24} />
                <h3>{risk.title}</h3>
                <p>{risk.content}</p>
              </article>
            );
          })}
        </div>
        <aside className="checklist-panel">
          <h3>临行复核清单</h3>
          <ul>
            {checklist.map((item) => (
              <li key={item}>
                <CheckCircle2 size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      <div className="fixed-note">
        所有价格、航班、天气、门票和酒店信息均为区间参考；最终以出发前 7 天和 48 小时实时复核为准。
      </div>
    </Section>
  );
}

function TopNav() {
  return (
    <header className="top-nav">
      <a href="#hero" className="brand">
        <MapPinned size={20} />
        <span>Travel to West</span>
      </a>
      <nav aria-label="页面章节">
        {navItems.map(([label, href]) => (
          <a href={`#${href}`} key={href}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function App() {
  return (
    <>
      <TopNav />
      <main>
        <HeroSlide />
        <DecisionSlide />
        <TimelineSlide />
        <RouteMapSlide />
        <WeatherSlide />
        <BackupSlide />
        <TransportCompareSlide />
        <BudgetSlide />
        <PhotoSlide />
        <RiskSlide />
      </main>
      <footer>
        <div>
          <Compass size={18} />
          <span>川西 travel_demo · 内容来源：doc/travel_plan1.md + doc/travel_plan2.md</span>
        </div>
        <div className="footer-icons" aria-label="页面内容主题">
          <Map size={18} />
          <Clock3 size={18} />
          <Landmark size={18} />
          <Banknote size={18} />
          <Luggage size={18} />
          <Sparkles size={18} />
        </div>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
