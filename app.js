console.log("✅ app.js loaded");

/* =====================
 权威来源
===================== */
var CMA_WIND_URL =
  "https://www.cma.gov.cn/2011xzt/2022zt/20220330/2022033011/202204/t20220412_4750933.html";
var CMA_CARD_URL =
  "https://www.cma.gov.cn/2011xzt/2015tgmb/202604/t20260405_7710967.html";

/* =====================
 防御要点（可核验）
===================== */
var WIND = {
  blue: {
    name: "蓝色",
    basis: [
      "对日常出行和室外活动开始产生影响，应注意防范。",
      "关好门窗，加固棚架、广告牌等，妥善安置室外物品。",
      "行人尽量少骑自行车，不在广告牌、临时搭建物下逗留。"
    ]
  },
  yellow: {
    name: "黄色",
    basis: [
      "骑行人群注意侧风影响，避免快速骑行或靠近大型设施。",
      "儿童户外活动需成人陪同，远离易被风吹动的物体。",
      "老人外出选择熟悉、安全路线，避免空旷区域。",
      "通勤人群留意广告牌、围挡等风险点，不久留。"
    ]
  },
  orange: {
    name: "橙色",
    basis: [
      "老人及行动不便人群减少外出，尽量避开强风时段。",
      "儿童不在树下、广告牌和临时设施附近停留；中小学校和单位可停课停业。",
      "通勤人群注意周围设施，尽量缩短在室外停留时间。",
      "骑行人群必要时下车推行或调整出行方式。",
      "切断危险电源，妥善安置室外物品。"
    ]
  },
  red: {
    name: "红色",
    basis: [
      "老人及行动不便人群避免单独外出。",
      "儿童不在窗边或阳台停留；中小学校和单位可停课停业。",
      "非必要不外出，调整通勤时间。",
      "骑行及户外活动暂停，尽快进入避风场所。",
      "切断危险电源，妥善安置室外物品。"
    ]
  }
};

var SEV = { blue: 1, yellow: 2, orange: 3, red: 4 };
var LIGHT_ICON = { "红": "🔴", "黄": "🟡", "绿": "🟢" };

function $(id) {
  return document.getElementById(id);
}

function hasClass(el, cls) {
  if (!el) return false;
  if (el.classList) return el.classList.contains(cls);
  return (" " + el.className + " ").indexOf(" " + cls + " ") >= 0;
}
function addClass(el, cls) {
  if (!el) return;
  if (el.classList) el.classList.add(cls);
  else if (!hasClass(el, cls)) el.className = el.className + " " + cls;
}
function removeClass(el, cls) {
  if (!el) return;
  if (el.classList) el.classList.remove(cls);
  else el.className = (" " + el.className + " ").replace(" " + cls + " ", " ").trim();
}
function toggleClass(el, cls) {
  if (!el) return;
  if (hasClass(el, cls)) removeClass(el, cls);
  else addClass(el, cls);
}

/* =====================
 标题动图（仅用 JS 注入，不改 HTML/CSS）
===================== */
function ensureWindIcon() {
  var h1 = document.querySelector('.head h1') || document.querySelector('h1');
  if (!h1) return;

  // 若已存在 wind-icon，则不重复添加
  if (h1.querySelector('.wind-icon')) return;

  var span = document.createElement('span');
  span.className = 'wind-icon';
  span.setAttribute('aria-hidden', 'true');
  span.innerHTML = '<span style="color:#38bdf8;">🌀</span><span style="color:#2563eb;">🛡️</span>';
  h1.insertBefore(span, h1.firstChild);

  // 注入必要样式（避免依赖外部CSS修改）
  if (!document.getElementById('windIconStyle')) {
    var st = document.createElement('style');
    st.id = 'windIconStyle';
    st.textContent = '\n.wind-icon{display:inline-block;margin-right:6px;animation:windSpin 4s ease-in-out infinite;}\n@keyframes windSpin{0%{transform:rotate(0deg);opacity:.9}25%{transform:rotate(5deg);opacity:1}50%{transform:rotate(0deg);opacity:.9}75%{transform:rotate(-5deg);opacity:1}100%{transform:rotate(0deg);opacity:.9}}\n';
    document.head.appendChild(st);
  }
}


function escapeHtml(str) {
  
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
function buildReviewReport(level, place, action) {
  var date = new Date().toLocaleString();
  var text = "";
  text += "【风小卫 · 学习复盘报告】\n\n";
  text += "生成时间：" + date + "\n\n";
  text += "▍风险背景\n";
  text += "大风预警颜色：" + WIND[level].name + "\n\n";
  text += "▍学习情境\n";
  text += "所在位置：" + getPlaceText(place) + "\n";
  text += "正在行为：" + getActionText(action) + "\n\n";
  text += "▍防御要点（学习参考）\n";
  text += WIND[level].basis.join("\n") + "\n\n";
  text += "▍学习说明\n";
  text += "本报告用于安全学习与复盘，不作为行动指令。\n";
  text += "紧急情况请听从老师、家长与官方发布的信息。\n\n";
  text += "—— 风小卫：大风天安全小管家";
  return text;
}
function appendReviewButton(level, place, action) {
  var out = document.getElementById("out");
  if (!out) return;

  // 防止重复添加
  if (document.getElementById("reviewBtn")) return;

  var btn = document.createElement("button");
  btn.id = "reviewBtn";
  btn.textContent = "📄 生成学习复盘报告";
  btn.style.marginTop = "10px";

  btn.onclick = function () {
    var report = buildReviewReport(level, place, action);
    var w = window.open("", "_blank");
    w.document.write(
      "<div style='font-family:Microsoft YaHei,Arial,sans-serif;" +
      "background:#f6f8fb;padding:24px;'>" +
    
        "<div style='max-width:620px;margin:0 auto;" +
        "background:#ffffff;border-radius:12px;" +
        "padding:20px;box-shadow:0 4px 12px rgba(0,0,0,0.08);'>" +
    
          "<div style='font-size:18px;font-weight:bold;margin-bottom:12px;" +
          "display:flex;align-items:center;gap:10px;'>" +
    
            "<span style='display:inline-block;font-size:34px;" +
            "animation:floatBook 2.8s ease-in-out infinite;'>📘✨</span>" +
    
            "<span>风小卫 · 学习复盘卡</span>" +
    
            "<style>" +
              "@keyframes floatBook{" +
                "0%{transform:translateY(0);}"+
                "50%{transform:translateY(-6px);}"+
                "100%{transform:translateY(0);}"+
              "}" +
            "</style>" +
    
          "</div>" +
    
          "<pre style='white-space:pre-wrap;font-size:14px;line-height:1.7;" +
          "background:#f9fafb;padding:14px;border-radius:8px;'>" +
          report +
          "</pre>" +
    
          "<div style='font-size:12px;color:#666;margin-top:12px;text-align:center;'>" +
          "该报告仅用于学习复盘 ｜ 不作为行动指令" +
          "</div>" +
    
        "</div>" +
      "</div>"
    );
    
    w.document.close();
  };

  out.appendChild(btn);
}

function trafficLight(level) {
  return SEV[level] >= 4 ? "红" : (SEV[level] >= 3 ? "黄" : "绿");
}

function getPlaceText(place) {
  var map = {
  road: "在路上（人行道或小区道路）",
  school: "在学校（校园或上下学途中）",
  home: "在家里（阳台或靠近窗户）",
  open_area: "在空旷区域（广场、路口或空地）",
  building_edge: "在建筑物附近（围挡、广告牌或楼下）"
};
  return map[place] + "当前环境";
}
function getActionText(action) {
  var map = {
  walk: "正常走路或外出活动",
  cross: "正在过马路",
  ride: "骑自行车或滑板车出行",
  umbrella: "撑着伞在外行走",
  near_tree: "在树下或广告牌旁停留",
  window: "靠近窗户或阳台查看外面情况",
  wait: "在路边或路口停留等候",
  outdoor_activity: "进行室外活动或玩耍"
};
  return map[action] + "进行当前行为";
}

function shuffleOptions(options, bestIndex) {
  var indexed = options.map(function (opt, idx) {
    return { text: opt, isBest: idx === bestIndex };
  });

  for (var i = indexed.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = indexed[i];
    indexed[i] = indexed[j];
    indexed[j] = tmp;
  }

  var newOptions = indexed.map(function (x) { return x.text; });
  var newBestIndex = indexed.findIndex(function (x) { return x.isBest; });

  return {
    options: newOptions,
    bestIndex: newBestIndex
  };
}

/* =====================
 任务卡（修复：红/橙判断使用 ||）
===================== */
function buildTaskCard(level, place, action) {
  var p = getPlaceText(place);
  var a = getActionText(action);

  if (level === "red" || level === "orange") {
    return (
      "你目前在" + p + "，正在" + a + "。\n" +
      "请重点观察广告牌、围挡、树木或临时设施是否晃动。\n" +
      "如有明显风险，及时改变路线或进入室内避风。"
    );
  }
  if (level === "yellow") {
    return (
      "你目前在" + p + "，正在" + a + "。\n" +
      "建议放慢行动节奏，避开空旷区域和易被风吹动的设施。\n" +
      "根据风力变化及时调整行动方式。"
    );
  }
  return (
    "当前为一般风力影响。\n" +
    "在" + p + a + "时，可提前留意周围环境变化，\n" +
    "避免长时间停留在风险点附近。"
  );
}

/* =====================
 参考依据
===================== */
function renderReferences(level) {
  var box = $("basisDetail");
  if (!box) return;

  box.innerHTML =
    "<div><b>大风预警颜色：</b>" + escapeHtml(WIND[level].name) + "</div>" +
    "<div><b>权威来源：</b></div>" +
    "<div>" +
    "<a href=\"" + CMA_WIND_URL + "\" target=\"_blank\">中国气象局：大风预警信号</a><br>" +
    "<a href=\"" + CMA_CARD_URL + "\" target=\"_blank\">中国气象局：气象灾害防御明白卡——大风篇</a>" +
    "</div>" +
    "<div class=\"basis-note\">说明：本工具用于科普学习与安全提醒，具体以官方发布为准。若某些风险标签未在权威条目中出现关键词，将仅作为场景提醒，不做条目高亮。</div>";
}

/* =====================
 AI 原稿（保持你原来的风格）
===================== */
function generateAIDraft(level, place, action) {
  var placeText = getPlaceText(place);
  var actionText = getActionText(action);

  var text =
    "【AI 分析判断】现在是【" + WIND[level].name + "】大风预警，你在【" + placeText + "】正在【" + actionText + "】。\n" +
    "【主要风险】大风可能引发高空坠物、行动不稳等情况。\n" +
    "【因为】大风会吹动广告牌、树枝和临时设施，也会影响行走和骑行稳定性。\n" +
    "【所以我建议】优先远离广告牌、树下和空旷区域，必要时进入室内避风。\n" +
    "【可核验】以上建议来自中国气象局发布的大风预警与防御要点。";

  var box = $("aiDraft");
  if (box) box.value = text;
}

/* =====================
 whyTip 文案（贴合当前选择）
===================== */
function buildWhyText(level, place, action) {
  var light = trafficLight(level);
  if (light !== "红" && light !== "黄") return "";

  var p = getPlaceText(place);
  var a = getActionText(action);
  var head = "当前为" + WIND[level].name + "大风预警，你正在" + p + a + "。\n";
  if (light === "红") {
    return head +
      "红灯表示：风险很高。\n" +
      "原因：强风更容易吹动广告牌、树枝和临时设施，坠物风险更高；同时行动更容易失稳。\n" +
      "建议：优先进入室内或避风处，远离树下、广告牌、围挡等位置。";
  }
  // 黄灯
  return head +
    "黄灯表示：需要谨慎。\n" +
    "原因：风力会影响稳定性，也可能吹动周围物体。\n" +
    "建议：放慢、观察、避开风险点，必要时调整路线或进入室内。";
}

/* =====================
 互动题（强贴合场景：place + action + level）
===================== */
function buildQuiz(level, place, action) {
  var strong = (level === "orange" || level === "red");
  var p = getPlaceText(place);
  var a = getActionText(action);

  var question =
    "当前为" + WIND[level].name + "大风预警，你正在" + p + a + "。\n" +
    "现在请选一个【更安全】的做法：";

  var options = [];
  var bestIndex = 0;
  var explainSafe = "";
  var explainRisk = "";

  // 路上
  if (place === "road") {
    if (action === "near_tree") {
      options = strong
        ? ["立刻离开树下/广告牌旁，进入附近室内或更安全的位置", "站在树下等风小一点再走", "到广告牌下避风"]
        : ["离开树下/广告牌旁，走到更安全的位置", "继续站在树下聊天", "到广告牌下避风"];
      bestIndex = 0;
      explainSafe = "树枝、广告牌和临时设施在大风下更容易晃动或坠落，先远离最安全。";
      explainRisk = "在树下/广告牌旁停留会增加被坠物砸到的风险。";
    } else if (action === "cross") {
      options = strong
        ? ["先停一下稳住身体，看清车流再通过；必要时请成人协助", "直接跑过去，越快越好", "站在围挡/广告牌旁边等一等"]
        : ["先看清左右，稳住身体再通过，不追赶不奔跑", "低头快跑过去", "在广告牌下面等更久"];
      bestIndex = 0;
      explainSafe = "大风会影响稳定和视线，过马路需要更稳、更慢、更专注。";
      explainRisk = "奔跑或靠近广告牌久等，会增加摔倒或坠物风险。";
    } else if (action === "ride") {
      options = strong
        ? [
            "在校园道路上明显减速，下车推行或改为步行，尽量稳住身体",
            "为了省时间，在校园里继续骑车快速穿行",
            "迎着风骑一段，看看速度会不会更快"
          ]
        : [
            "在校园内放慢速度骑行，必要时下车推行，尽量避开同学聚集的地方",
            "和同学一起比速度，加快骑车通过校园道路",
            "专门找迎风的位置试试骑车的感觉"
          ];
      bestIndex = 0;
      explainSafe = "侧风会把车把吹偏，骑行更容易失稳；慢下来或下车推行更安全。";
      explainRisk = "加速或边骑边打伞会更难控制方向，摔倒风险更高。";
    } else if (action === "umbrella") {
      options = strong
        ? ["尽量收伞或不用伞，改用帽子/雨衣并贴近安全路线，必要时进入室内", "把伞撑得更高更大挡风", "迎着风跑，紧握伞不放"]
        : ["注意风向，必要时收伞，避开人群和道路边缘", "把伞举很高边走边转伞", "站在路边举伞拍照"];
      bestIndex = 0;
      explainSafe = "大风会把伞吹翻，容易带偏身体或碰到他人；必要时收伞更安全。";
      explainRisk = "撑大伞/举高伞/奔跑会增加失衡与碰撞风险。";
    } else {
      options = strong
        ? ["放慢脚步，避开广告牌/树下/围挡，尽快进入室内或避风处", "靠近广告牌下走更挡风", "在树下停下来休息"]
        : ["放慢脚步，避开广告牌/树下/围挡，注意周围变化", "靠近广告牌下走更挡风", "在树下停下来休息"];
      bestIndex = 0;
      explainSafe = "路上风险点多（树枝、广告牌、围挡），避开这些位置更安全。";
      explainRisk = "靠近广告牌/树下停留会提高坠物风险。";
    }

  // 学校
  } else if (place === "school") {
    if (action === "window") {
      options = strong
        ? [
            "靠近窗户观察外面的风力情况，看看树木和旗子被吹成什么样子",
            "站在窗户旁但不打开窗户，觉得只要不探头出去就是安全的",
            "主动远离窗户和阳台位置，关好门窗，并按照老师的安排在教室内安全区域活动"
          ]
        : [
            "走到窗户旁看看外面风大不大",
            "站在窗边但不打开窗户，简单观察一下情况",
            "远离窗户位置，在教室内活动，并留意老师的安全提示"
          ];
      bestIndex = 2;
      explainSafe = "大风天气下，窗户可能出现玻璃震动或物品坠落风险。远离窗边并听从老师安排，是学校环境中更安全的做法。";
      explainRisk = "靠近窗户观察或长时间停留，可能忽视玻璃破裂、窗体晃动或坠落物带来的危险。";
    } else if (action === "ride") {
      options = strong
        ? ["校园内尽量不骑，改为推行或步行", "在校园里快速骑行穿行", "在风口处试试骑更快"]
        : ["慢骑或推行，避开人群密集区域", "和同学比赛加速骑", "在风口处试试能不能更快"];
      bestIndex = 0;
      explainSafe = "校园人多，风大会影响骑行稳定；慢行或推行更安全。";
      explainRisk = "快速骑行更容易碰撞、摔倒。";
    } else if (action === "cross") {
      options = strong
        ? ["不奔跑不追赶，排队慢行；必要时等老师指挥", "和同学比赛谁跑得快先过", "在人多处推挤过去"]
        : ["慢行不打闹，注意脚下与周围，同学保持距离", "边跑边说笑打闹", "从最挤的地方钻过去"];
      bestIndex = 0;
      explainSafe = "学校人多，风大会影响稳定；慢行、听指挥更安全。";
      explainRisk = "奔跑推挤更容易摔倒或碰撞。";
    } else if (action === "umbrella") {
      options = strong
        ? ["尽量收伞或不用伞，防止伞翻；跟随老师进入室内", "在操场上撑伞转圈玩", "把伞举高给大家挡风"]
        : ["在人多处尽量收伞或放低，避免戳到别人", "在走廊口撑伞玩", "把伞举很高边走边甩水"];
      bestIndex = 0;
      explainSafe = "学校人多，伞在大风里容易翻转，收伞或放低更安全。";
      explainRisk = "撑伞玩耍或举高会增加碰撞与摔倒风险。";
    } else {
      options = strong
        ? ["按老师要求行动，尽量走室内通道或避风路线", "在操场空旷处跑一跑", "去大树下看看树枝会不会掉"]
        : ["慢行不打闹，避开树下/旗杆/围挡等风险点", "边走边追逐打闹", "在树下停下来聊天"];
      bestIndex = 0;
      explainSafe = "学校场景更重要的是“听老师安排 + 不打闹 + 避开风险点”。";
      explainRisk = "打闹追逐会在大风天更容易摔倒或撞到别人。";
    }

  // 家里
  } else if (place === "home") {
    if (action === "window") {
      options = strong
        ? ["站在阳台或窗户旁观察外面风势情况，看看风有多大", "打开窗户或探头查看情况，想着在自己家里应该问题不大", "远离阳台和窗户位置，关好门窗，并将阳台上的花盆、杂物等收回室内"]
        : ["走到窗户旁简单看看外面的风情况", "把窗户开一条缝通通风，顺便观察一下", "减少靠近窗户和阳台的时间，检查并固定阳台上的物品"];
      bestIndex = 2;
      explainSafe = "大风天气下，阳台和窗户附近可能出现物品坠落或窗体受损风险。远离窗边并提前收好物品，有助于减少意外发生的可能性。";
      explainRisk = "靠近窗户或阳台观察风势，可能忽视突发强风带来的坠物或窗户破损风险。";
    } else if (action === "near_tree") {
      options = strong
        ? ["不要在楼下树下/广告牌旁停留，回到室内更安全", "站在树下看树枝晃动", "到广告牌下避风"]
        : ["离开树下/广告牌附近，避免坠物", "在树下多停一会儿", "到广告牌下避风"];
      bestIndex = 0;
      explainSafe = "楼下树枝和广告牌在大风里更容易掉落，回室内是更稳的选择。";
      explainRisk = "在树下/广告牌旁停留会提高坠物风险。";
    } else if (action === "ride") {
      options = strong
        ? ["强风不建议骑车；改为步行或等风小再出门", "继续骑车，越快越安全", "边骑边撑伞"]
        : ["慢骑或推行，避开空旷路段", "继续快速骑行", "靠近建筑物边骑更挡风"];
      bestIndex = 0;
      explainSafe = "强风骑车更不稳；强风更建议不骑或改为推行/步行。";
      explainRisk = "快速骑行或撑伞骑行会显著提高失稳风险。";
    } else if (action === "umbrella") {
      options = strong
        ? ["尽量不出门；若必须外出，尽量不用伞，改用帽子/雨衣更稳", "出门就撑大伞挡风", "拿着伞在空旷处试风"]
        : ["若伞被吹翻就收伞，避免伞带偏身体", "把伞撑得很高走快点", "站在阳台门口举伞玩"];
      bestIndex = 0;
      explainSafe = "伞在大风里会像“风帆”，容易失衡；强风更建议减少外出。";
      explainRisk = "撑大伞/举高伞更容易被吹翻、碰撞或摔倒。";
    } else {
      options = strong
        ? ["尽量不出门；若必须外出，慢行并避开广告牌/围挡", "马上出门跑一圈看看风", "站在楼下广告牌附近等朋友"]
        : ["出门前看看楼下有无松动物体，走路时避开广告牌/树下", "一路跑越快越好", "走到建筑物边上看看风更大不大"];
      bestIndex = 0;
      explainSafe = "家里场景关键是“减少外出 + 出门前检查楼下风险”。";
      explainRisk = "随意外出或靠近广告牌会增加坠物风险。";
    }

  // 兜底
  } else {
    options = ["远离广告牌/树下/围挡，选择更安全位置", "在风险点附近停留", "去空旷地方试风"];
    bestIndex = 0;
    explainSafe = "避开风险点更安全。";
    explainRisk = "在风险点停留更危险。";
  }

  return {
    question: question,
    options: options,
    bestIndex: bestIndex,
    explainSafe: explainSafe,
    explainRisk: explainRisk
  };
}
  
  /* =====================
   输出（保持原输出风格）
  ===================== */
  function generateOutput(level, place, action) {
    var out = $("lightText");
    var light = trafficLight(level);
  
    if (out) {
      out.innerHTML =
        
        "<span id=\"lightLine\"><b>安全建议灯（交通灯）： "
        + LIGHT_ICON[light] + " " + light
        + "<b><span id=\"whyTip\" class=\"why-tip hide\">？</span>;"
        + "</span><b><b><br><br>" +
        "<b>🛡️ 防御要点（可核验）：</b><br>" +
        "<div style=\"font-size:13px; line-height:1.6; margin-top:4px;\">" +
        WIND[level].basis.map(function (t) {
          var safe = escapeHtml(t);
          var hit = /广告牌|棚架|高空|坠物|树下|临时设施|围挡|临时搭建物/.test(t);
          return hit
            ? "• <span class=\"hl\">" + safe + "</span> <span class=\"risk-badge\">⚠ 高空坠物风险</span>"
            : "• " + safe;
        }).join("<br>");
    }
  
    renderReferences(level);
    generateAIDraft(level, place, action);
  
    var myEdit = $("myEdit");
    if (myEdit) {
      myEdit.value = WIND[level].basis.map(function (x, i) { return (i + 1) + ". " + x; }).join("\n");
    }
  
    // whyTip：只在红/黄灯时启用
    var whyTip = $("whyTip");
    var whyText = buildWhyText(level, place, action);
    if (whyTip) {
      if (whyText) {
        removeClass(whyTip, "hide");
        whyTip.title = "点击查看：为什么是" + light + "灯？";
        whyTip.setAttribute("data-why", whyText);
      } else {
        addClass(whyTip, "hide");
        whyTip.setAttribute("data-why", "");
      }
    }
  
  
    // whyTip 图标放到“安全建议灯”右侧（仅调整位置，不改 HTML）
    var line = $("lightLine");
    var tip = $("whyTip");
    if (line && tip) {
      line.appendChild(tip);
    }
  }
  
  /* =====================
   渲染互动题到 riskTags（不改 HTML/CSS，纯复用容器）
  ===================== */
  function renderQuiz(level, place, action) {
    var quizBox = $("riskTags");
    if (!quizBox) return;
  
    var quiz = buildQuiz(level, place, action);
  
    removeClass(quizBox, "hide");
  
    // ✅ 取消“正确选项固定在第 1 项”的刻意感（只打乱顺序）
    var shuffled = shuffleOptions(quiz.options, quiz.bestIndex);
    quiz.options = shuffled.options;
    quiz.bestIndex = shuffled.bestIndex;
  
    // 互动题放在安全建议灯上方（调整 DOM 顺序，不改 HTML）
    var outBox = $("out");
    var lightEl = $("lightText");
  
    // ✅ 语法修复：&&
    if (outBox && quizBox && lightEl) {
      if (quizBox.parentNode !== outBox) {
        outBox.insertBefore(quizBox, outBox.firstChild);
      }
  
      if (lightEl.parentNode === outBox) {
        outBox.insertBefore(quizBox, lightEl);
      } else {
        outBox.insertBefore(quizBox, outBox.firstChild);
      }
    }
  
    // 如果找得到安全建议灯，就插在它前面
    if (lightEl && lightEl.parentNode === outBox) {
      outBox.insertBefore(quizBox, lightEl);
    } else {
      outBox.insertBefore(quizBox, outBox.firstChild);
    }
  
    // 为了“看得见”，加一点内联边距（不改 CSS）
    quizBox.innerHTML =
      "<div style=\"margin-top:6px;\"><b>互动小判断题（选一项）：</b></div>" +
      "<div style=\"margin-top:6px; white-space:pre-line;\">" + escapeHtml(quiz.question) + "</div>" +
      "<div style=\"margin-top:8px;\">" +
      quiz.options.map(function (opt, idx) {
        return (
          "<label style=\"display:block; margin:6px 0; cursor:pointer;\">" +
          "<input type=\"radio\" name=\"quiz\" value=\"" + idx + "\" /> " +
          escapeHtml(opt) +
          "</label>"
        );
      }).join("") +
      "</div>" +
      "<button id=\"quizSubmit\" class=\"ghost\" style=\"margin-top:8px;\">提交答案</button>" +
      "<div id=\"quizFeedback\" style=\"margin-top:8px;\"></div>";
  
    var submitBtn = $("quizSubmit");
    if (submitBtn) {
      submitBtn.onclick = function () {
        var radios = document.querySelectorAll("input[name=\"quiz\"]");
        var chosen = -1;
        for (var i = 0; i < radios.length; i++) {
          if (radios[i].checked) {
            chosen = parseInt(radios[i].value, 10);
            break;
          }
        }
  
        var feedbackEl = $("quizFeedback");
        if (chosen < 0) {
          if (feedbackEl) {
            feedbackEl.innerHTML = "<span class=\"risk-badge\">请先选一项再提交。</span>";
          }
          return;
        }
  
        var isBest = (chosen === quiz.bestIndex);
        var tag = isBest
          ? "✅ 更安全"
          : "<span style=\"color:#d92d20; font-weight:700;\">⚠ 有风险</span>";
        var explain = isBest ? quiz.explainSafe : quiz.explainRisk;
  
        if (feedbackEl) {
          feedbackEl.innerHTML =
            "<div><b>结果：</b>" + tag + "</div>" +
            "<div style=\"margin-top:4px; white-space:pre-line;\">" + escapeHtml(explain) + "</div>" +
            "<div style=\"margin-top:6px; color:#666; font-size:12px;\">（下面将生成建议卡；安全建议灯（交通灯）为红/黄灯时可点“？”看原因）</div>";
        }
  
        generateOutput(level, place, action);
      };
    }
  }
  
  /* =====================
   绑定事件（等 DOM 就绪再绑定，避免“找不到元素”）
  ===================== */
  function bindAll() {
    // 补回标题前的动图（不改HTML）
    ensureWindIcon();
  
    var btn = $("btn");
    if (btn) {
      btn.onclick = function () {
        var level = $("level") ? $("level").value : "blue";
        var place = $("place") ? $("place").value : "road";
        var action = $("action") ? $("action").value : "walk";
  
        // 点击先出互动题
        renderQuiz(level, place, action);
  
        
        
        
        appendReviewButton(level, place, action);
      };
    }
  
    var whyTipEl = $("whyTip");
    if (whyTipEl) {
      whyTipEl.onclick = function () {
        var whyText = this.getAttribute("data-why") || "";
        if (!whyText) return;
  
        var quizBox = $("riskTags");
        if (!quizBox) return;
        removeClass(quizBox, "hide");
  
        // toggle 展示解释
        var whyEl = $("whyExplain");
        if (!whyEl) {
          quizBox.innerHTML +=
            "<div id=\"whyExplain\" style=\"margin-top:10px; padding-top:8px; border-top:1px dashed #f0c36d; white-space:pre-line;\"></div>";
          whyEl = $("whyExplain");
        }
  
        if (whyEl) {
          var shown = whyEl.getAttribute("data-shown") === "1";
          if (shown) {
            whyEl.innerHTML = "";
            whyEl.setAttribute("data-shown", "0");
          } else {
            var light = trafficLight($("level") ? $("level").value : "blue");
            whyEl.innerHTML = "<b>为什么是" + light + "灯？</b>\n" + escapeHtml(whyText);
            whyEl.setAttribute("data-shown", "1");
          }
        }
      };
    }
  
    var basisBtn = $("basisBtn");
    if (basisBtn) {
      basisBtn.onclick = function () {
        var box = $("basisDetail");
        if (!box) return;
  
        // 若即将展开且内容为空，则先渲染权威链接与说明（保持原有依据展开内容）
        var willShow = hasClass(box, "hide");
        if (willShow) {
          if (!box.innerHTML || box.innerHTML.replace(/\s+/g, '') === '') {
            var lv = $("level") ? $("level").value : "blue";
            renderReferences(lv);
          }
        }
  
        toggleClass(box, "hide");
        this.textContent = hasClass(box, "hide") ? "依据展开" : "收起依据";
      };
    }
  }
  
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindAll);
  } else {
    bindAll();
  }
  