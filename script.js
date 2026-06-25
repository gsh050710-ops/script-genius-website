const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "关闭导航" : "打开导航");
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

const typeButtons = [...document.querySelectorAll(".type-tabs button")];
const moodButtons = [...document.querySelectorAll(".mood-tags button")];
const generateButton = document.querySelector("#generate-button");
const regenerateButton = document.querySelector("#regenerate-button");
const copyButton = document.querySelector("#copy-button");
const outputDocument = document.querySelector("#output-document");
const outputType = document.querySelector("#output-type");
const outputTitle = document.querySelector("#output-title");
const outputLogline = document.querySelector("#output-logline");
const outputConflict = document.querySelector("#output-conflict");
const outputHook = document.querySelector("#output-hook");
const ideaInput = document.querySelector("#idea-input");

let selectedType = "微短剧";
let storyIndex = 0;

const storySets = {
  微短剧: [
    {
      title: "《潮汐之外》",
      logline:
        "一封来自未来的信，把寻找失踪姐姐的林秋引向废弃码头；她以为自己在追查过去，却发现真正等待她的是尚未发生的选择。",
      conflict:
        "林秋必须在午夜潮汐上涨前打开 17 号储物柜，但信中每一条指引，都正在让现实变得与三年前那场事故一模一样。",
      hook: "镜头特写：信纸右下角的邮戳日期，是三年后的今天。",
    },
    {
      title: "《第十七封信》",
      logline:
        "旧码头每逢涨潮便会出现一封无人投递的信，而第十七封信上，写着女主角明天将说出的最后一句话。",
      conflict:
        "她必须决定是否按照信中的步骤救下陌生人，却发现每改动一个细节，身边就有一个人忘记她。",
      hook: "手机时间跳到 00:00，海面上突然亮起一排写着她名字的灯。",
    },
  ],
  品牌广告: [
    {
      title: "《一封晚到的回信》",
      logline:
        "漂洋过海的东方茶香，替一位海外游子完成了一封迟到三年的家书，也让品牌成为连接两种生活的温柔媒介。",
      conflict:
        "产品不直接被讲述，而是在女儿与父亲跨越时差的生活细节中，成为彼此理解的共同记忆。",
      hook: "女孩拆开快递，家乡雨声从茶罐开启的一瞬间涌入异国公寓。",
    },
  ],
  文旅短片: [
    {
      title: "《山河寄来的信》",
      logline:
        "一名城市女孩循着未来的自己留下的手绘地图，走进古镇、山林与非遗工坊，重新理解故乡为何值得被看见。",
      conflict:
        "她只剩一天时间找到地图终点，却逐渐意识到，终点并不是一个景点，而是一段正在消失的手艺。",
      hook: "三年前寄出的明信片上，风景竟与她此刻站立的位置完全重合。",
    },
  ],
  电影: [
    {
      title: "《雾港来信》",
      logline:
        "气象研究员林秋回到故乡调查异常海雾，在一组来自未来的信件中，发现姐姐的失踪与一场尚未发生的灾难互为因果。",
      conflict:
        "为了阻止灾难，她必须证明信件真实；可每一次公开证据，都会加速信中预言的发生。",
      hook: "海雾覆盖城市前，所有收音机同时播放出三年后的遇难者名单。",
    },
  ],
};

typeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    typeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedType = button.dataset.type;
    storyIndex = 0;
  });
});

moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("active");
  });
});

function renderStory(nextVersion = false) {
  const stories = storySets[selectedType] || storySets["微短剧"];
  if (nextVersion) storyIndex = (storyIndex + 1) % stories.length;
  const story = stories[storyIndex];

  outputDocument.classList.add("refreshing");

  window.setTimeout(() => {
    outputType.textContent = selectedType;
    outputTitle.textContent = story.title;
    outputLogline.textContent = story.logline;
    outputConflict.textContent = story.conflict;
    outputHook.textContent = story.hook;
    outputDocument.classList.remove("refreshing");
  }, 320);
}

generateButton?.addEventListener("click", () => {
  const label = generateButton.querySelector(".generate-label");
  generateButton.classList.add("loading");
  label.textContent = "正在构思故事...";

  window.setTimeout(() => {
    generateButton.classList.remove("loading");
    label.textContent = "生成故事雏形";
    renderStory(false);
  }, 850);
});

regenerateButton?.addEventListener("click", () => {
  renderStory(true);
});

copyButton?.addEventListener("click", async () => {
  const text = [
    outputTitle.textContent,
    outputLogline.textContent,
    `核心冲突：${outputConflict.textContent}`,
    `黄金钩子：${outputHook.textContent}`,
  ].join("\n\n");

  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "已复制 ✓";
    window.setTimeout(() => {
      copyButton.textContent = "复制";
    }, 1600);
  } catch {
    copyButton.textContent = "请手动复制";
  }
});

ideaInput?.addEventListener("input", () => {
  if (ideaInput.value.length > 220) {
    ideaInput.value = ideaInput.value.slice(0, 220);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1120) {
    nav?.classList.remove("open");
    body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});
